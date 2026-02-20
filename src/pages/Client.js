import React, { useEffect, useState } from "react";
import "../App.css";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";

function Client() {

  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [showContact, setShowContact] = useState(false);   // ✅ Contact Modal

  useEffect(() => {
    fetch("http://localhost:5000/projects")
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.log(err));
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="projects-page">

      {/* ================= HEADER ================= */}
      <div className="client-header">
        <h1>Available Projects</h1>

        <div style={{ display: "flex", gap: "15px" }}>

          {/* Admin Portfolio */}
          <button
            className="primary-btn"
            onClick={() => navigate("/portfolio")}
          >
            Admin Portfolio
          </button>

          {/* Contact Button */}
          <button
            className="primary-btn"
            onClick={() => setShowContact(true)}
          >
            Contact
          </button>

          {/* Logout */}
          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>
      </div>

      {/* ================= PROJECT LIST ================= */}
      <div className="project-container">
        <div className="project-scroll-box">

          {projects.map((project) => (
            <div className="project-card" key={project.id}>

              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-image"
                />
              )}

              <h3>{project.title}</h3>
              <p><strong>Technology:</strong> {project.tech}</p>
              <p><strong>Price:</strong> ₹{project.price}</p>

              <button
                className="buy-btn"
                onClick={() => {
                  setSelectedProject(project);
                  setPaymentDone(false);
                }}
              >
                Buy / Contact
              </button>

            </div>
          ))}

        </div>
      </div>

      {/* ================= PAYMENT MODAL ================= */}
      {selectedProject && (
        <div className="payment-overlay">
          <div className="payment-modal">

            {!paymentDone ? (
              <>
                <h2>Scan & Pay</h2>

                <p><strong>Project:</strong> {selectedProject.title}</p>
                <p><strong>Amount:</strong> ₹{selectedProject.price}</p>

                <QRCodeCanvas
                  value={`upi://pay?pa=7979078017@ybl&pn=HarshRaj&am=${selectedProject.price}&cu=INR&tn=ProjectPurchase`}
                  size={220}
                />

                <p style={{ marginTop: "10px" }}>
                  Scan using any UPI app
                </p>

                <button
                  className="primary-btn"
                  style={{ marginTop: "15px" }}
                  onClick={() => setPaymentDone(true)}
                >
                  I Have Paid
                </button>

                <button
                  className="delete-btn"
                  style={{ marginTop: "10px" }}
                  onClick={() => setSelectedProject(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h2 style={{ color: "lightgreen" }}>
                  ✅ Payment Successful
                </h2>

                <p>Thank you for purchasing {selectedProject.title}.</p>

                <button
                  className="primary-btn"
                  onClick={() => setSelectedProject(null)}
                >
                  Close
                </button>
              </>
            )}

          </div>
        </div>
      )}

      {/* ================= CONTACT MODAL ================= */}
      {showContact && (
        <div className="contact-overlay">
          <div className="contact-modal">

            <h3>Contact Details</h3>

            <p><strong>Name:</strong> Harsh Raj</p>
            <p><strong>Phone:</strong> +91 7979078017</p>
            <p><strong>Email:</strong> harsh3289raj@gmail.com</p>
            <p><strong>UPI:</strong> 7979078017@ybl</p>

            <button
              className="close-btn"
              onClick={() => setShowContact(false)}
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Client;