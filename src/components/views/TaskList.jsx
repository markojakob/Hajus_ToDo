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
import { produce } from "immer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function TaskList() {
  const navigate = useNavigate();
  const URL = "https://demo2.z-bit.ee";

  const [tasks, setTasks] = useState([]);
  // Redirect
  useEffect(() => {
    if (!token && window.location.pathname !== "/register") {
      navigate("/login");
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch(`${URL}/tasks`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to load tasks", error);
      }
    };

    fetchTasks();
  }, [navigate, token]);

  const handleNameChange = async (task, event) => {
    const newTitle = event.target.value;
    const taskId = task.id;
    const response = await fetch(`${URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle }),
    });
    if (response.ok) {
      const newTasks = produce(tasks, (draft) => {
        const index = draft.findIndex((t) => t.id === task.id);
        draft[index].title = newTitle;
      });
      setTasks(newTasks);
    } else {
      const err = await response.json();
      console.error("Failed to change title: ", err);
      message.error("Failed to update task title.");
    }
  };

  const handleCompletedChange = async (task, event) => {
    const newState = event.target.checked;
    const taskId = task.id;
    const response = await fetch(`${URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ marked_as_done: newState }),
    });
    if (response.ok) {
      const newTasks = produce(tasks, (draft) => {
        const index = draft.findIndex((t) => t.id === task.id);
        draft[index].marked_as_done = newState;
      });
      setTasks(newTasks);
    } else {
      const err = await response.json();
      console.error("Failed to update completion status: ", err);
      message.error("Failed to update task status.");
    }
  };

  const handleAddTask = async () => {
    const response = await fetch(`${URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: "", desc: "" }),
    });
    if (response.ok) {
      const newTask = await response.json();
      setTasks(
        produce(tasks, (draft) => {
          draft.push(newTask);
        })
      );
    } else {
      const err = await response.json();
      console.error("Failed to add task: ", err);
      message.error("Failed to add task.");
    }
  };

  const handleDeleteTask = async (task) => {
    const taskId = task.id;
    const response = await fetch(`${URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setTasks(
        produce(tasks, (draft) => {
          const index = draft.findIndex((t) => t.id === task.id);
          draft.splice(index, 1);
        })
      );
    } else {
      const err = await response.json();
      console.error("Failed to delete task: ", err);
      message.error("Failed to delete task.");
    }
  };

  return (
    <Row justify="center" style={{ minHeight: "100vh", marginTop: "6rem" }}>
      <Col span={12}>
        <h1>Task List</h1>
        <Button
          onClick={handleAddTask}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add Task
        </Button>
        <Divider />
        <List
          size="small"
          bordered
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item key={task.id}>
              <Row
                justify="space-between"
                align="middle"
                style={{ width: "100%" }}
              >
                <Space>
                  <Checkbox
                    checked={task.marked_as_done}
                    onChange={(e) => handleCompletedChange(task, e)}
                  />
                  <Input
                    value={task.title}
                    onChange={(e) => handleNameChange(task, e)}
                    placeholder="Task title"
                    style={{ width: 300 }}
                  />
                </Space>
                <Button
                  type="text"
                  danger
                  onClick={() => handleDeleteTask(task)}
                >
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
