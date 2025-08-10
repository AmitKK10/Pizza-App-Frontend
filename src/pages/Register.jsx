// src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Register.css";

const API_BASE_URL = "https://pizza-app-backend-vert.vercel.app"; // ✅ Change once, use everywhere

const Register = () => {
  const [step, setStep] = useState(1); // 1 = Register, 2 = Verify OTP
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("customer");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateStepOne = () => {
    if (!name || !email || !password || !mobile) {
      toast.warning("Please fill in all fields");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.warning("Enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast.warning("Enter a valid 10-digit mobile number");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateStepOne()) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name,
        email,
        password,
        mobile,
        role,
      });
      toast.info("OTP sent to your email/mobile. Please verify.");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.warning("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
        email,
        otp,
      });
      toast.success("Verification successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="pizza-animation"></div>
        <h2 className="title">
          {step === 1 ? "Create Your Account 🍕" : "Verify OTP 🔐"}
        </h2>
        <p className="subtitle">
          {step === 1
            ? "Join the pizza family today!"
            : "Enter the OTP sent to your email"}
        </p>

        {step === 1 ? (
          <>
            <input
              className="input-field"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input-field"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="input-field"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <select
              className="input-field"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
            <button
              className="register-btn"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : "Register"}
            </button>
            <p className="login-text">
              Already have an account?{" "}
              <button
                className="link-button"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </p>
          </>
        ) : (
          <>
            <input
              className="input-field"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="register-btn"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
