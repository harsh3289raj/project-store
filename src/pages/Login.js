import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Client");

  const handleLogin = () => {
    localStorage.setItem("user", username);

    if (role === "Admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/client";
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h1 className="login-title">Login</h1>

        <input
          className="login-input"
          placeholder="Email"
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

    <div className="login-options">
  <label>
    <input type="checkbox" /> Remember Me
  </label>

  <span
    className="link-text"
    onClick={() => (window.location.href = "/forgot")}
  >
    Forgot Password
  </span>
</div>

<p
  className="register-text"
  onClick={() => (window.location.href = "/register")}
>
  Don't have an account? <b>Register</b>
</p>



        <select
          className="login-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>Client</option>
          <option>Admin</option>
        </select>

        <button className="login-button" onClick={handleLogin}>
          Log in
        </button>

        <p className="register-text">
          Don't have a account? Register
        </p>

      </div>
    </div>
  );
}

export default Login;
