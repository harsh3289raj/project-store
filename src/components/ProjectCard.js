import React from "react";
import "./ProjectCard.css";

function ProjectCard({ title, tech, price, image }) {
  const phoneNumber = "7979078017";

  const message = `Hi, I'm interested in your project: ${title}`;
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="project-card">
      {image && (
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",
            borderRadius: "10px",
            marginBottom: "10px",
          }}
        />
      )}

      <h3>{title}</h3>
      <p><b>Technology:</b> {tech}</p>
      <p><b>Price:</b> ₹{price}</p>

      <a href={whatsappLink} target="_blank" rel="noreferrer">
        <button className="buy-btn">Buy / Contact</button>
      </a>
    </div>
  );
}

export default ProjectCard;
