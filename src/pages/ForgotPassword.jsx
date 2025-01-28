// src/pages/ForgotPassword.jsx
import React from 'react';
import ForgotForm from '../components/auth/ForgotForm';
import '../assets/styles/ForgotPassword.css';

const ForgotPassword = () => {
  return (
    <div className="forgot-container">
      <ForgotForm />
    </div>
  );
};

export default ForgotPassword;