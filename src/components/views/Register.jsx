import { Form, Input, Button, Row, Col, notification } from "antd";
import { useNavigate } from "react-router";

const URL = "https://demo2.z-bit.ee";

export default function Register() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch(`${URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          firstname: values.firstname,
          lastname: values.lastname,
          newPassword: values.password,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        notification.error({ message: `Registration failed: ${err.message || response.status}` });
        return;
      }

      notification.success({ message: "Registration successful! Please log in." });
      navigate("/login");
    } catch (error) {
      notification.error({ message: "Registration error. Please try again." });
      console.error("Registration error:", error);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col span={6}>
        <h1>Register</h1>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ username: "", firstname: "", lastname: "", password: "" }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }, { type: "email", message: "Invalid username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="First Name"
            name="firstname"
            rules={[{ required: true, message: "Please input your first name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastname"
            rules={[{ required: true, message: "Please input your last name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }, { min: 6, message: "Password must be at least 6 characters." }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="default" onClick={() => navigate("/login")} block>
              Back to Login
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
