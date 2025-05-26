import { DeleteOutlined } from "@ant-design/icons";
import {
  Input,
  Button,
  Checkbox,
  List,
  Col,
  Row,
  Space,
  Divider,
  message,
} from "antd";
import debounce from "lodash.debounce";
import { produce } from "immer";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";

export default function TaskList() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const URL = "https://demo2.z-bit.ee";
  const [tasks, setTasks] = useState([]);

  const debouncedTaskTitle = useRef(
    debounce(async (taskId, newName) => {
      if (!newName.trim()) return;
      try {
        const response = await fetch(`${URL}/tasks/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newName }),
        });

        if (!response.ok) {
          message.error("Failed to update task title.");
        }
      } catch {
        message.error("Error updating task title.");
      }
    }, 1000)
  ).current;

  useEffect(() => {

    const fetchTasks = async () => {
      try {
        const response = await fetch(`${URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          const mappedTasks = data.map((task) => ({
            id: task.id,
            name: task.title,
            completed: task.marked_as_done,
          }));
          setTasks(mappedTasks);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to load tasks", error);
      }
    };

    fetchTasks();
    return () => {
      debouncedTaskTitle.cancel();
    };
  }, [navigate, token, debouncedTaskTitle]);

  const handleNameChange = (task, event) => {
    const newName = event.target.value;

    setTasks((prev) =>
      produce(prev, (draft) => {
        const index = draft.findIndex((t) => t.id === task.id);
        if (index !== -1) draft[index].name = newName;
      })
    );

    debouncedTaskTitle(task.id, newName);
  };

  const handleCompletedChange = async (task, event) => {
    const checked = event.target.checked;
    const response = await fetch(`${URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ marked_as_done: checked }),
    });
    if (response.ok) {
      setTasks(
        produce(tasks, (draft) => {
          const index = draft.findIndex((t) => t.id === task.id);
          draft[index].completed = checked;

        })
      );
      console.log(checked)
    } else {
      message.error("Failed to update task status.");
    }
  };

  const handleAddTask = async () => {
    const ID = uuidv4();
    const response = await fetch(`${URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: ID, title: "New Task", desc: "" }),
    });

    if (response.ok) {
      const newTask = await response.json();
      setTasks(
        produce(tasks, (draft) => {
          draft.push({
            id: newTask.id,
            name: newTask.title,
            completed: newTask.marked_as_done,
          });
        })
      );
      console.log(newTask.id);
    } else {
      message.error("Failed to add task.");
    }
  };

  const handleDeleteTask = async (task) => {
    const response = await fetch(`${URL}/tasks/${task.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      setTasks(
        produce(tasks, (draft) => {
          const index = draft.findIndex((t) => t.id === task.id);
          draft.splice(index, 1);
        })
      );
    } else {
      message.error("Failed to delete task.");
    }
  };

  return (
    <Row
      type="flex"
      justify="center"
      style={{ minHeight: "100vh", marginTop: "6rem" }}
    >
      <Col span={12}>
        <h1>Task List</h1>
        <Button onClick={handleAddTask}>Add Task</Button>
        <Button onClick={() => navigate("/logout")}>Logout</Button>
        <Divider />
        <List
          size="small"
          bordered
          dataSource={tasks}
          renderItem={(task) => (

            <List.Item key={task.id}>
              <Row
                type="flex"
                justify="space-between"
                align="middle"
                style={{ width: "100%" }}
              >
                <Space>
                  <Checkbox
                    checked={task.completed}
                    onChange={(e) => handleCompletedChange(task, e)}
                  />
                  <Input
                    value={task.name}
                    onChange={(e) => handleNameChange(task, e)}
                  />
                </Space>
                <Button type="text" onClick={() => handleDeleteTask(task)}>
                  <DeleteOutlined />
                </Button>
              </Row>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
}
