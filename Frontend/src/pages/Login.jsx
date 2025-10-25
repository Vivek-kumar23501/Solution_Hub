import { useState } from "react";
import { Container, Form, FormGroup, Input, Button } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      if (res.data.success) {
        const { token, user } = res.data;

        // Save token & user in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        alert("Login successful!");

        // ✅ Role-based redirection
        switch (user.role) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "user":
            navigate("/dashboard");
            break;
          default:
            navigate("/dashboard"); // fallback
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container
      className="mt-5"
      style={{
        maxWidth: "400px",
        background: "#fff",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      }}
    >
      <h2 className="text-center mb-4">Login</h2>
      <Form>
        <FormGroup>
          <Input
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </FormGroup>
        <Button color="primary" className="w-100" onClick={handleLogin}>
          Login
        </Button>
      </Form>
      <div className="text-center mt-2">
        <a href="/forgot-password">Forgot Password?</a> | <a href="/signup">Signup</a>
      </div>
    </Container>
  );
};

export default Login;
