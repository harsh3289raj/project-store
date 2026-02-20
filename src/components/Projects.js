import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import "../App.css";

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  return (
    <div className="projects-page">
      <div className="hero-section">
        <h1>Explore Available Projects</h1>
        <p>Browse ready-to-use academic and development projects</p>
      </div>

      <div className="project-container">
        <h2 className="container-title">Available Projects</h2>

        <div className="project-scroll-box">
          {projects.length === 0 ? (
            <p style={{ color: "white" }}>No projects available</p>
          ) : (
            projects.map((p) => (
              <ProjectCard
                key={p.id}
                title={p.title}
                tech={p.tech}
                price={p.price}
                image={p.image}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;
