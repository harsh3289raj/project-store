import React, { useState } from "react";
import "./Login.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    alert("Registered successfully!");
    window.location.href = "/";
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Register</h1>

        <input
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;
