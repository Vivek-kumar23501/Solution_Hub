import { useState } from 'react';
import { Container, Form, FormGroup, Input, Button } from 'reactstrap';
import { FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 1: send OTP
  const sendOTP = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      if (res.data.success) {
        alert(res.data.message);
        setStep(2);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending OTP');
    }
  };

  // Step 2: verify OTP
  const verifyOTP = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password/verify-otp', { email, otp });
      if (res.data.success) {
        alert(res.data.message);
        setStep(3);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP');
    }
  };

  // Step 3: reset password
  const resetPassword = async () => {
    if (password !== confirmPassword) return alert('Passwords do not match!');
    try {
      const res = await axios.put('http://localhost:5000/api/auth/forgot-password/reset', { email, password });
      if (res.data.success) {
        alert(res.data.message);
        setStep(1);
        setEmail(''); setOtp(''); setPassword(''); setConfirmPassword('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <Container className="card-container">
      <h2 className="text-center mb-4">Forgot Password</h2>
      <Form>
        {step === 1 && (
          <FormGroup className="mb-3 position-relative">
            <FaEnvelope className="position-absolute" style={{ top: '12px', left: '10px', color:'#764ba2' }}/>
            <Input type="email" placeholder="Enter your Email" required value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: '35px' }} />
            <Button color="warning" className="w-100 mt-2" onClick={sendOTP}>Send OTP</Button>
          </FormGroup>
        )}
        {step === 2 && (
          <FormGroup>
            <Input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
            <Button color="success" className="w-100 mt-2" onClick={verifyOTP}>Verify OTP</Button>
          </FormGroup>
        )}
        {step === 3 && (
          <>
            <FormGroup>
              <Input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </FormGroup>
            <Button color="success" className="w-100" onClick={resetPassword}>Reset Password</Button>
          </>
        )}
      </Form>
      <div className="text-center mt-2"><Link to="/login">Back to Login</Link></div>
    </Container>
  );
};

export default ForgotPassword;
