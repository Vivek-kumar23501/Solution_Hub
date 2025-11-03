import { useState } from "react";
import { Container, Form, FormGroup, Input, Button } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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

        // Use AuthContext login function
        login(token, user);

        alert("Login successful!");

        // Role-based redirection
        switch (user.role) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "user":
            navigate("/dashboard/home");
            break;
          default:
            navigate("/dashboard/home");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        padding: "2rem"
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          background: "rgba(30, 41, 59, 0.9)",
          backdropFilter: "blur(20px)",
          padding: "2.5rem",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        }}
      >
        {/* Logo and Header */}
        <div className="text-center mb-4">
          <div
            style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)"
            }}
          >
            <span style={{ fontSize: "1.5rem", color: "white" }}>⚡</span>
          </div>
          <h2 style={{ 
            color: "#f1f5f9", 
            fontWeight: "700",
            background: "linear-gradient(135deg, #f1f5f9, #cbd5e1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.5rem"
          }}>
            Welcome Back
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Sign in to your CodeMaster account
          </p>
        </div>

        <Form onKeyPress={handleKeyPress}>
          <FormGroup className="mb-3">
            <Input
              placeholder="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                color: "#f1f5f9",
                padding: "0.75rem 1rem",
                fontSize: "0.9rem"
              }}
              className="border-0"
            />
          </FormGroup>
          
          <FormGroup className="mb-4">
            <Input
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                color: "#f1f5f9",
                padding: "0.75rem 1rem",
                fontSize: "0.9rem"
              }}
              className="border-0"
            />
          </FormGroup>
          
          <Button
            color="primary"
            className="w-100 border-0"
            onClick={handleLogin}
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              borderRadius: "10px",
              padding: "0.75rem",
              fontWeight: "600",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(139, 92, 246, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.3)";
              }
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </Form>

        {/* Links */}
        <div className="text-center mt-4" style={{ color: "#94a3b8" }}>
          <a 
            href="/forgot-password" 
            style={{ 
              color: "#8b5cf6", 
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}
            onMouseEnter={(e) => e.target.style.color = "#a78bfa"}
            onMouseLeave={(e) => e.target.style.color = "#8b5cf6"}
          >
            Forgot Password?
          </a> 
          <span style={{ margin: "0 0.5rem" }}>•</span>
          <a 
            href="/signup" 
            style={{ 
              color: "#8b5cf6", 
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}
            onMouseEnter={(e) => e.target.style.color = "#a78bfa"}
            onMouseLeave={(e) => e.target.style.color = "#8b5cf6"}
          >
            Create Account
          </a>
        </div>

        {/* Demo Info */}
        <div 
          style={{
            marginTop: "2rem",
            padding: "1rem",
            background: "rgba(15, 23, 42, 0.6)",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            textAlign: "center"
          }}
        >
          <p style={{ 
            color: "#94a3b8", 
            fontSize: "0.8rem", 
            marginBottom: "0.5rem", 
            fontWeight: "600" 
          }}>
            🔐 Secure Login
          </p>
          <p style={{ 
            color: "#cbd5e1", 
            fontSize: "0.75rem", 
            margin: "0",
            lineHeight: "1.4"
          }}>
            Your credentials are securely encrypted and protected
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Login;