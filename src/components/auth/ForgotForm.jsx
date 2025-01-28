import React, { useState } from "react";
import axios from "axios";
import Modal from "../common/Modal";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Input from "../common/Input"; // Impor komponen Input

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle password visibility

  const navigate = useNavigate(); // Hook untuk navigasi

  // Fungsi untuk menangani submit form kirim link
  const handleSendLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://dumovies-production.up.railway.app/forgot-password",
        {
          email,
        }
      );

      if (response.status === 200) {
        setModalState({
          isOpen: true,
          title: "Reset Link Sent",
          message: "Reset link sent to your email. Please check your inbox!",
        });
        setCurrentStep(3); // Langsung ke proses reset password
      } else {
        setModalState({
          isOpen: true,
          title: "Failed to Send Link",
          message: "Failed to send reset link. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setModalState({
        isOpen: true,
        title: "Server Error",
        message: "Server error. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menangani OTP dan password baru
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://dumovies-production.up.railway.app/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );

      if (response.status === 200) {
        setModalState({
          isOpen: true,
          title: "Password Reset Successful",
          message: "Your password has been reset successfully!",
        });
        setCurrentStep(3); // Pindah ke langkah berikutnya jika perlu
        // Navigasi ke halaman sign-in setelah berhasil reset password
        setTimeout(() => {
          navigate("/signin"); // Arahkan pengguna ke halaman sign-in setelah beberapa detik
        }, 2000); // Tunda selama 2 detik sebelum navigasi
      } else {
        setModalState({
          isOpen: true,
          title: "Failed to Reset Password",
          message: "Failed to reset password. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setModalState({
        isOpen: true,
        title: "Server Error",
        message: "Server error. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setModalState({ isOpen: false, title: "", message: "" });
  };

  // Step 1: Send Reset Link
  if (currentStep === 1) {
    return (
      <div className="forgot-content">
        <Modal
          isOpen={modalState.isOpen}
          title={modalState.title}
          message={modalState.message}
          onClose={closeModal}
        />
        <p className="forgot-subtitle">
          Forgot your password? No worries, we'll help you reset it!
        </p>
        <h2 className="forgot-title">Forgot Password</h2>
        <form className="forgot-form" onSubmit={handleSendLink}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="custom-input"
              placeholder="Enter your registered email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="custom-button" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    );
  }

  // Step 3: Reset Password
  if (currentStep === 3) {
    return (
      <div className="forgot-content">
        <Modal
          isOpen={modalState.isOpen}
          title={modalState.title}
          message={modalState.message}
          onClose={closeModal}
        />
        <h2 className="forgot-title">Reset Password</h2>
        <p className="forgot-subtitle">
          Enter your email, the OTP sent to your email, and set a new password.
        </p>
        <form className="forgot-form" onSubmit={handleVerifyOtp}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="custom-input"
              placeholder="Enter your registered email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="otp">OTP Code</label>
            <input
              type="text"
              id="otp"
              className="custom-input"
              placeholder="Enter your 6-digit OTP..."
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <div className="form-group password-input-wrapper">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-container">
              <Input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password..."
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "👁" : "🙈"}
              </button>
            </div>
          </div>
          <button type="submit" className="custom-button" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    );
  }

  return null;
};

export default ForgotPassword;