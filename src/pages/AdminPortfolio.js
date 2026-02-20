import React, { useEffect, useState } from "react";
import "../App.css";

function AdminPortfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    image: null
  });

  const loadPortfolio = async () => {
    const res = await fetch("http://localhost:5000/portfolio");
    const data = await res.json();
    setPortfolio(data);
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("link", form.link);
    formData.append("image", form.image);

    if (editingId) {
      await fetch(`http://localhost:5000/portfolio/${editingId}`, {
        method: "PUT",
        body: formData
      });
      setEditingId(null);
    } else {
      await fetch("http://localhost:5000/portfolio", {
        method: "POST",
        body: formData
      });
    }

    setForm({
      title: "",
      description: "",
      link: "",
      image: null
    });

    loadPortfolio();
  };

  const editPortfolio = (p) => {
    setForm({
      title: p.title,
      description: p.description,
      link: p.link,
      image: null
    });
    setEditingId(p.id);
  };

  const deletePortfolio = async (id) => {
    await fetch(`http://localhost:5000/portfolio/${id}`, {
      method: "DELETE"
    });
    loadPortfolio();
  };

  return (
    <div className="admin-page">

      <div className="admin-header">
        <h1>Portfolio Projects</h1>

        <button
          className="primary-btn"
          onClick={() => window.location.href = "/admin"}
        >
          ← Back to Admin
        </button>
      </div>

      <div className="admin-grid">

        {/* ADD / EDIT FORM */}
        <div className="admin-card">
          <h2>{editingId ? "Edit Portfolio Project" : "Add Portfolio Project"}</h2>

          <input
            placeholder="Project Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            placeholder="Project Description"
            rows="4"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            placeholder="Project Link"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />

          <button className="primary-btn" onClick={handleSubmit}>
            {editingId ? "Update Portfolio" : "Add Portfolio"}
          </button>
        </div>

        {/* MANAGE PORTFOLIO */}
        <div className="admin-card">
          <h2>Manage Portfolio Projects</h2>

          <div className="scroll-box">
            {portfolio.map((p) => (
              <div key={p.id} className="project-row">

                {p.image && (
                  <img
                    src={`http://localhost:5000${p.image}`}
                    alt=""
                    style={{ width: "120px", borderRadius: "6px" }}
                  />
                )}

                <h3>{p.title}</h3>
                <p>{p.description}</p>

                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#00c3ff" }}
                  >
                    View Project
                  </a>
                )}

                <div style={{ marginTop: "8px", display: "flex", gap: "10px" }}>
                  <button
                    className="primary-btn"
                    onClick={() => editPortfolio(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deletePortfolio(p.id)}
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminPortfolio;