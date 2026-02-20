import React, { useEffect, useState } from "react";
import "../App.css";
import profile from "../assets/DP.jpg";
import { useNavigate } from "react-router-dom";

function Portfolio() {

  const [portfolio, setPortfolio] = useState([]);
  const [openId, setOpenId] = useState(null); // ✅ Toggle state
  const navigate = useNavigate();

  // FETCH PORTFOLIO FROM BACKEND
  useEffect(() => {
    fetch("https://angelic-creation-production-d8b1.up.railway.app/portfolio")
      .then((res) => res.json())
      .then((data) => setPortfolio(data))
      .catch((err) => console.log("Portfolio Fetch Error:", err));
  }, []);

  return (
    <div className="portfolio-page">

      {/* NAVBAR */}
      <div className="portfolio-navbar">

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            className="primary-btn"
            style={{ padding: "6px 14px", fontSize: "14px" }}
            onClick={() => navigate("/client")}
          >
            ← Back
          </button>

          <h2>Harsh Raj</h2>
        </div>

        <div className="portfolio-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="/resume.pdf" target="_blank" rel="noreferrer">Resume</a>

          <a
            href="https://www.linkedin.com/in/harsh-raj15072003"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>

      {/* HERO */}
      <div className="portfolio-hero">
        <div className="profile-image-container">
          <img src={profile} alt="profile" />
        </div>

        <div className="portfolio-text">
          <h1>MCA Student • AI & ML Developer</h1>
          <p>
            Passionate about building AI systems, computer vision applications,
            and full-stack software solutions.
          </p>
        </div>
      </div>

      {/* ABOUT */}
      <div className="portfolio-section" id="about">
        <h2>About Me</h2>

        <p className="portfolio-paragraph">
          Hello! I’m Harsh Raj, an MCA student specializing in Artificial Intelligence 
          and Machine Learning with a strong foundation in Full-Stack Development.
        </p>

        <p className="portfolio-paragraph">
          I have developed AI-based systems including object detection, fraud detection, 
          interview analysis tools, and full-stack management systems.
        </p>

        <p className="portfolio-paragraph">
          My technical stack includes Python, Java, React.js, Node.js, MySQL, 
          Machine Learning, OpenCV, and TensorFlow.
        </p>
      </div>

      {/* SKILLS */}
      <div className="portfolio-section" id="skills">
        <h2>Skills</h2>

        <div className="portfolio-grid">
          <div className="portfolio-card">Python</div>
          <div className="portfolio-card">Java</div>
          <div className="portfolio-card">AI / ML</div>
          <div className="portfolio-card">SQL / NoSQL</div>
          <div className="portfolio-card">HTML / CSS</div>
          <div className="portfolio-card">JavaScript</div>
        </div>
      </div>

      {/* PROJECTS - DYNAMIC WITH TOGGLE */}
      <div className="portfolio-section" id="projects">
        <h2>Projects</h2>

        <div className="portfolio-grid">

          {portfolio.length === 0 ? (
            <p>No portfolio projects added yet.</p>
          ) : (
            portfolio.map((p) => (
              <div className="portfolio-card" key={p.id}>

                {/* IMAGE */}
                {p.image && (
                  <img
                    src={`https://angelic-creation-production-d8b1.up.railway.app/portfolio${p.image}`}
                    alt={p.title}
                    style={{
                      width: "100%",
                      borderRadius: "12px",
                      marginBottom: "12px"
                    }}
                  />
                )}

                {/* TITLE */}
                <h3>{p.title}</h3>

                {/* TOGGLE BUTTON */}
                <button
                  className="primary-btn"
                  style={{ marginTop: "10px" }}
                  onClick={() =>
                    setOpenId(openId === p.id ? null : p.id)
                  }
                >
                  {openId === p.id ? "Hide Details" : "View Details"}
                </button>

                {/* DESCRIPTION (ONLY WHEN OPEN) */}
                {openId === p.id && (
                  <div style={{ marginTop: "15px" }}>
                    <p style={{ lineHeight: "1.6" }}>
                      {p.description}
                    </p>

                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-block",
                          marginTop: "10px",
                          color: "#00c3ff",
                          fontWeight: "500"
                        }}
                      >
                        View Project
                      </a>
                    )}
                  </div>
                )}

              </div>
            ))
          )}

        </div>
      </div>

      {/* FOOTER */}
      <footer className="portfolio-footer">
        <h3>Contact Me</h3>

        <div className="footer-links">
          <a href="mailto:harsh3289raj@gmail.com">
            📧 harsh3289raj@gmail.com
          </a>

          <a href="tel:+917979078017">
            📞 +91 7979078017
          </a>

          <a
            href="https://www.linkedin.com/in/harsh-raj15072003"
            target="_blank"
            rel="noreferrer"
          >
            🔗 LinkedIn
          </a>
        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} Harsh Raj. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default Portfolio;