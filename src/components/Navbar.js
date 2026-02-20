import React from "react";
import "./Navbar.css";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="navbar">
      <h2>Project Store</h2>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;
