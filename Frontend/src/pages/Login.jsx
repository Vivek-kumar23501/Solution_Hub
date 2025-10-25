import { useState } from "react";
import { Container, Form, FormGroup, Input, Button } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      if (res.data.success) {
        const { token, user } = res.data;

        // ✅ Store separately for easy access
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userEmail", user.email);

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
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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
        <Button
          color="primary"
          className="w-100"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Form>
      <div className="text-center mt-2">
        <a href="/forgot-password">Forgot Password?</a> | <a href="/signup">Signup</a>
      </div>
    </Container>
  );
};

export default Login;
