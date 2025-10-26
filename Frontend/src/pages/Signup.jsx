import { useState } from "react";
import { Container, FormGroup, Input, Button } from "reactstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: "",
    bio: "",
    location: "",
    profilePic: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      setForm({ ...form, profilePic: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

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
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("mobile", form.phone);
      formData.append("password", form.password);
      formData.append("bio", form.bio);
      formData.append("location", form.location);
      if (form.profilePic) formData.append("profilePic", form.profilePic);

      const res = await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        alert("Signup Completed 🎉");
        setForm({ name: "", email: "", phone: "", otp: "", password: "", confirmPassword: "", bio: "", location: "", profilePic: null });
        setStep(1);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed ❌");
    }
  };

  const linkStyle = {
    display: "block",
    textAlign: "center",
    marginTop: "1rem",
    color: "#764ba2",
    textDecoration: "none",
    fontWeight: "500",
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
          <Link to="/login" style={linkStyle}>Already have an account? Login</Link>
        </>
      )}

      {step === 2 && (
        <>
          <FormGroup><Input type="text" name="otp" placeholder="Enter OTP" onChange={handleChange} /></FormGroup>
          <Button color="success" className="w-100" onClick={verifyOTP}>Verify OTP</Button>
          <Link to="/login" style={linkStyle}>Back to Login</Link>
        </>
      )}

      {step === 3 && (
        <>
          <FormGroup><Input type="password" name="password" placeholder="Password" onChange={handleChange} /></FormGroup>
          <FormGroup><Input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} /></FormGroup>
          <FormGroup><Input type="text" name="bio" placeholder="Short Bio" onChange={handleChange} /></FormGroup>
          <FormGroup><Input type="text" name="location" placeholder="Location" onChange={handleChange} /></FormGroup>
          <FormGroup>
            <Input type="file" name="profilePic" onChange={handleChange} accept="image/*" />
          </FormGroup>
          <Button color="success" className="w-100" onClick={register}>Create Account</Button>
          <Link to="/login" style={linkStyle}>Back to Login</Link>
        </>
      )}
    </Container>
  );
};

export default Signup;
