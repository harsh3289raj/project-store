import React, { useEffect, useState } from "react";
import "../App.css";

function Admin() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    tech: "",
    price: "",
    image: ""
  });

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const loadProjects = async () => {
    const res = await fetch("http://localhost:5000/projects");
    const data = await res.json();
    setProjects(data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ADD / UPDATE STORE PROJECT */
  const handleSubmit = async () => {
    if (editingId) {
      await fetch(`http://localhost:5000/projects/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      setEditingId(null);
    } else {
      await fetch("http://localhost:5000/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
    }

    setForm({ title: "", tech: "", price: "", image: "" });
    loadProjects();
  };

  const editProject = (p) => {
    setForm({
      title: p.title,
      tech: p.tech,
      price: p.price,
      image: p.image
    });
    setEditingId(p.id);
  };

  const deleteProject = async (id) => {
    await fetch(`http://localhost:5000/projects/${id}`, {
      method: "DELETE"
    });
    loadProjects();
  };

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div
        className="admin-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <h1>Admin Dashboard</h1>

          <button
            className="primary-btn"
            onClick={() => window.location.href = "/admin/portfolio"}
          >
           Portfolio Projects
          </button>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="admin-grid">

        {/* ADD / EDIT STORE PROJECT */}
        <div className="admin-card">
          <h2>{editingId ? "Edit Project" : "Add Project"}</h2>

          <input
            placeholder="Project Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            placeholder="Technology"
            value={form.tech}
            onChange={(e) => setForm({ ...form, tech: e.target.value })}
          />

          <input
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />

          <button className="primary-btn" onClick={handleSubmit}>
            {editingId ? "Update Project" : "Add Project"}
          </button>
        </div>

        {/* MANAGE STORE PROJECTS */}
        <div className="admin-card">
          <h2>Manage Projects</h2>

          <div className="scroll-box">
            {projects.map((p) => (
              <div key={p.id} className="project-row">
                <h3>{p.title}</h3>
                <p>{p.tech}</p>
                <p>₹{p.price}</p>

                {p.image && (
                  <img
                    src={p.image}
                    alt=""
                    style={{ width: "120px", borderRadius: "6px" }}
                  />
                )}

                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    gap: "10px"
                  }}
                >
                  <button
                    className="primary-btn"
                    onClick={() => editProject(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteProject(p.id)}
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

export default Admin;