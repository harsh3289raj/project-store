const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   STATIC UPLOAD FOLDER
========================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   MULTER CONFIGURATION
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* =========================
   MYSQL CONNECTION (Railway)
========================= */

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to Railway MySQL");
  }
});

/* =========================
   PROJECT ROUTES
========================= */

app.get("/projects", (req, res) => {
  db.query("SELECT * FROM projects ORDER BY id DESC", (err, result) => {
    if (err) {
      console.log("PROJECT FETCH ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

app.post("/projects", (req, res) => {
  const { title, tech, price, image } = req.body;

  db.query(
    "INSERT INTO projects (title, tech, price, image) VALUES (?, ?, ?, ?)",
    [title, tech, price, image],
    (err, result) => {
      if (err) {
        console.log("PROJECT INSERT ERROR:", err);
        return res.status(500).json(err);
      }
      res.json({ message: "Project added", id: result.insertId });
    }
  );
});

app.put("/projects/:id", (req, res) => {
  const { title, tech, price, image } = req.body;
  const id = req.params.id;

  db.query(
    "UPDATE projects SET title=?, tech=?, price=?, image=? WHERE id=?",
    [title, tech, price, image, id],
    (err) => {
      if (err) {
        console.log("PROJECT UPDATE ERROR:", err);
        return res.status(500).json(err);
      }
      res.json({ message: "Project updated" });
    }
  );
});

app.delete("/projects/:id", (req, res) => {
  db.query("DELETE FROM projects WHERE id=?", [req.params.id], (err) => {
    if (err) {
      console.log("PROJECT DELETE ERROR:", err);
      return res.status(500).json(err);
    }
    res.json({ message: "Project deleted" });
  });
});

/* =========================
   PORTFOLIO ROUTES
========================= */

app.get("/portfolio", (req, res) => {
  db.query("SELECT * FROM portfolio ORDER BY id DESC", (err, result) => {
    if (err) {
      console.log("PORTFOLIO FETCH ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

app.post("/portfolio", upload.single("image"), (req, res) => {
  const { title, description, link } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  db.query(
    "INSERT INTO portfolio (title, description, link, image) VALUES (?, ?, ?, ?)",
    [title, description, link, image],
    (err) => {
      if (err) {
        console.log("PORTFOLIO INSERT ERROR:", err);
        return res.status(500).json(err);
      }
      res.json({ message: "Portfolio project added" });
    }
  );
});

app.put("/portfolio/:id", upload.single("image"), (req, res) => {
  const { title, description, link } = req.body;
  const id = req.params.id;

  if (req.file) {
    const image = `/uploads/${req.file.filename}`;

    db.query(
      "UPDATE portfolio SET title=?, description=?, link=?, image=? WHERE id=?",
      [title, description, link, image, id],
      (err) => {
        if (err) {
          console.log("PORTFOLIO UPDATE ERROR:", err);
          return res.status(500).json(err);
        }
        res.json({ message: "Portfolio updated" });
      }
    );
  } else {
    db.query(
      "UPDATE portfolio SET title=?, description=?, link=? WHERE id=?",
      [title, description, link, id],
      (err) => {
        if (err) {
          console.log("PORTFOLIO UPDATE ERROR:", err);
          return res.status(500).json(err);
        }
        res.json({ message: "Portfolio updated" });
      }
    );
  }
});

app.delete("/portfolio/:id", (req, res) => {
  db.query("DELETE FROM portfolio WHERE id=?", [req.params.id], (err) => {
    if (err) {
      console.log("PORTFOLIO DELETE ERROR:", err);
      return res.status(500).json(err);
    }
    res.json({ message: "Portfolio project deleted" });
  });
});

/* =========================
   RESUME ROUTES
========================= */

app.get("/resume", (req, res) => {
  db.query("SELECT * FROM resume LIMIT 1", (err, result) => {
    if (err) {
      console.log("RESUME FETCH ERROR:", err);
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.json({ resume_link: "" });
    }

    res.json(result[0]);
  });
});

app.put("/resume", (req, res) => {
  const { resume_link } = req.body;

  db.query(
    "UPDATE resume SET resume_link=? WHERE id=1",
    [resume_link],
    (err) => {
      if (err) {
        console.log("RESUME UPDATE ERROR:", err);
        return res.status(500).json(err);
      }
      res.json({ message: "Resume updated" });
    }
  );
});

/* =========================
   START SERVER (IMPORTANT FOR RENDER)
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});