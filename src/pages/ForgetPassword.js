import React, { useState } from "react";
import "./Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = () => {
    alert("Password reset link sent!");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Forgot Password</h1>

        <input
          className="login-input"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="login-button" onClick={handleReset}>
          Send Reset Link
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
