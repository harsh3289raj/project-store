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
   MULTER CONFIG
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
    console.error("❌ DB Connection Failed:", err);
  } else {
    console.log("✅ Connected to Railway MySQL");
  }
});

/* =========================
   AUTH ROUTES
========================= */

// REGISTER USER
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  db.query(
    "INSERT INTO users (name,email,password) VALUES (?,?,?)",
    [name, email, password],
    (err) => {
      if (err) {
        return res.status(400).json({
          message: "User already exists"
        });
      }

      res.json({ message: "Registered successfully" });
    }
  );
});

// LOGIN USER + ADMIN PROTECTION
app.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  // ✅ ONLY THIS EMAIL CAN ACCESS ADMIN
  if (role === "admin" && email !== "harsh3289raj@gmail.com") {
    return res.status(403).json({
      message: "Cannot login through Admin"
    });
  }

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    (err, result) => {

      if (err)
        return res.status(500).json({ message: "Server error" });

      if (result.length === 0)
        return res.status(400).json({ message: "User not found" });

      const user = result[0];

      if (user.password !== password)
        return res.status(400).json({ message: "Wrong password" });

      res.json({
        message: "Login successful",
        user
      });
    }
  );
});

/* =========================
   PROJECT ROUTES
========================= */

app.get("/projects", (req, res) => {
  db.query("SELECT * FROM projects ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/projects", (req, res) => {
  const { title, tech, price, image } = req.body;

  db.query(
    "INSERT INTO projects(title,tech,price,image) VALUES(?,?,?,?)",
    [title, tech, price, image],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Project added",
        id: result.insertId
      });
    }
  );
});

app.put("/projects/:id", (req, res) => {
  const { title, tech, price, image } = req.body;

  db.query(
    "UPDATE projects SET title=?,tech=?,price=?,image=? WHERE id=?",
    [title, tech, price, image, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Project updated" });
    }
  );
});

app.delete("/projects/:id", (req, res) => {
  db.query(
    "DELETE FROM projects WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Project deleted" });
    }
  );
});

/* =========================
   PORTFOLIO ROUTES
========================= */

app.get("/portfolio", (req, res) => {
  db.query("SELECT * FROM portfolio ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/portfolio", upload.single("image"), (req, res) => {
  const { title, description, link } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  db.query(
    "INSERT INTO portfolio(title,description,link,image) VALUES(?,?,?,?)",
    [title, description, link, image],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Portfolio added" });
    }
  );
});

app.put("/portfolio/:id", upload.single("image"), (req, res) => {
  const { title, description, link } = req.body;

  if (req.file) {
    const image = `/uploads/${req.file.filename}`;

    db.query(
      "UPDATE portfolio SET title=?,description=?,link=?,image=? WHERE id=?",
      [title, description, link, image, req.params.id],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Portfolio updated" });
      }
    );
  } else {
    db.query(
      "UPDATE portfolio SET title=?,description=?,link=? WHERE id=?",
      [title, description, link, req.params.id],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Portfolio updated" });
      }
    );
  }
});

app.delete("/portfolio/:id", (req, res) => {
  db.query(
    "DELETE FROM portfolio WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Portfolio deleted" });
    }
  );
});

/* =========================
   RESUME ROUTES
========================= */

app.get("/resume", (req, res) => {
  db.query("SELECT * FROM resume LIMIT 1", (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result[0] || { resume_link: "" });
  });
});

app.put("/resume", (req, res) => {
  const { resume_link } = req.body;

  db.query(
    "UPDATE resume SET resume_link=? WHERE id=1",
    [resume_link],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Resume updated" });
    }
  );
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});