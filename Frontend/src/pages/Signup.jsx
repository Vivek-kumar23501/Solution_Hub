import { useState } from "react";
import { Container, Form, FormGroup, Input, Button } from "reactstrap";
import axios from "axios";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const sendOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        name: form.name,
        email: form.email,
      });
      if (res.data.success) {
        alert("OTP Sent ✅");
        setStep(2);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  const verifyOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: form.email,
        otp: form.otp,
      });
      if (res.data.success) {
        alert("OTP Verified ✅");
        setStep(3);
      }
    } catch (err) {
      alert("Incorrect OTP ❌");
    }
  };

  const register = async () => {
    if (form.password !== form.confirmPassword)
      return alert("Passwords do not match!");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      if (res.data.success) {
        alert("Signup Completed 🎉");
        setForm({ name: "", email: "", phone: "", otp: "", password: "", confirmPassword: "" });
        setStep(1);
      }
    } catch (err) {
      alert("Registration failed ❌");
    }
  };

  return (
    <Container className="mt-5" style={{
      maxWidth: "400px",
      background: "#fff",
      padding: "2rem",
      borderRadius: "10px",
      boxShadow: "0 0 12px rgba(0,0,0,0.2)"
    }}>
      <h2 className="text-center mb-4">Signup</h2>

      {step === 1 && (
        <>
          <FormGroup><Input name="name" placeholder="Full Name" onChange={handleChange} /></FormGroup>
          <FormGroup><Input type="email" name="email" placeholder="Email" onChange={handleChange} /></FormGroup>
          <FormGroup><Input type="tel" name="phone" placeholder="Phone" onChange={handleChange} /></FormGroup>
          <Button color="primary" className="w-100" onClick={sendOTP}>Send OTP</Button>
        </>
      )}

      {step === 2 && (
        <>
          <FormGroup><Input type="text" name="otp" placeholder="Enter OTP" onChange={handleChange} /></FormGroup>
          <Button color="success" className="w-100" onClick={verifyOTP}>Verify OTP</Button>
        </>
      )}

      {step === 3 && (
        <>
          <FormGroup><Input type="password" name="password" placeholder="Password" onChange={handleChange} /></FormGroup>
          <FormGroup><Input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} /></FormGroup>
          <Button color="success" className="w-100" onClick={register}>Create Account</Button>
        </>
      )}
    </Container>
  );
};

export default Signup;
