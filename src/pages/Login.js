import React, { useState } from "react";
import "./Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API =
    "https://YOUR-RAILWAY-URL.up.railway.app"; // ⭐ CHANGE

  const handleLogin = async () => {

    try {

      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      // ✅ SUCCESS LOGIN
      window.location.href = "/admin";

    } catch (err) {
      setError("Server not reachable");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h1>Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

        {error && (
          <p style={{color:"red"}}>{error}</p>
        )}

      </div>
    </div>
  );
}

export default Login;