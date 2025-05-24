import { Form, Input, Button, Row, Col, notification } from "antd";
import { useNavigate } from "react-router";

const URL = "https://demo2.z-bit.ee";

export default function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch(`${URL}/users/get-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      if (!response.ok) {
        notification.error({ message: "Wrong username or password" });
        return;
      }

      const data = await response.json();
      notification.success({ message: "Logged in" });

      // FIX: Save token with same key your other code expects
      localStorage.setItem("access_token", data.access_token);

      navigate("/");
    } catch (error) {
      notification.error({ message: "Login failed. Please try again." });
      console.error("Login error:", error);
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh" }}
    >
      <Col span={6}>
        <h1>Login</h1>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ username: "", password: "" }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => navigate("/register")} block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
