const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

/* ================= CONFIG ================= */

const ADMIN_EMAIL = "harsh3289raj@gmail.com";
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

/* ================= CORS (VERY IMPORTANT) ================= */

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-vercel-app.vercel.app"   // ⭐ CHANGE THIS
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

/* ================= STATIC FILES ================= */

app.use("/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ================= MULTER ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

/* ================= DATABASE ================= */

let db;

if (process.env.MYSQL_URL) {
  db = mysql.createConnection(process.env.MYSQL_URL);
  console.log("🌍 Using Railway DB");
} else {
  db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "3289",
    database: "projectstore"
  });
  console.log("💻 Using Local DB");
}

db.connect(err => {
  if (err) console.log("❌ DB ERROR:", err);
  else console.log("✅ MySQL Connected");
});

/* ================= AUTH MIDDLEWARE ================= */

const verifyToken = (req, res, next) => {

  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ message: "Login Required" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Invalid Token" });

    req.user = decoded;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (req.user.email !== ADMIN_EMAIL)
    return res.status(403).json({ message: "Admin Only Access" });

  next();
};

/* ================= REGISTER ADMIN ================= */

app.post("/register", async (req, res) => {

  const { name, email, password } = req.body;

  // Only admin allowed
  if (email !== ADMIN_EMAIL)
    return res.status(403).json({
      message: "Only Owner Can Register"
    });

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users(name,email,password) VALUES(?,?,?)",
    [name, email, hash],
    err => {
      if (err)
        return res.status(400).json({ message: "Admin already exists" });

      res.json({ message: "Admin Registered" });
    }
  );
});

/* ================= LOGIN (ADMIN ONLY) ================= */

app.post("/login", (req, res) => {

  const { email, password } = req.body;

  // 🔥 HARD ADMIN BLOCK
  if (email !== ADMIN_EMAIL)
    return res.status(403).json({
      message: "Access Denied — Not Admin"
    });

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {

      if (err)
        return res.status(500).json({ message: "Server Error" });

      if (result.length === 0)
        return res.status(400).json({ message: "Admin Not Found" });

      const user = result[0];

      const valid = await bcrypt.compare(password, user.password);

      if (!valid)
        return res.status(400).json({ message: "Wrong Password" });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: "admin"
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      });

      res.json({
        message: "Admin Login Success"
      });
    }
  );
});

/* ================= LOGOUT ================= */

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged Out" });
});

/* ================= PROJECTS ================= */

app.get("/projects", (req, res) => {
  db.query(
    "SELECT * FROM projects ORDER BY id DESC",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

app.post("/projects",
  verifyToken,
  verifyAdmin,
  (req, res) => {

    const { title, tech, price, image } = req.body;

    db.query(
      "INSERT INTO projects(title,tech,price,image) VALUES(?,?,?,?)",
      [title, tech, price, image],
      (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({
          message: "Project Added",
          id: result.insertId
        });
      }
    );
  }
);

app.delete("/projects/:id",
  verifyToken,
  verifyAdmin,
  (req, res) => {

    db.query(
      "DELETE FROM projects WHERE id=?",
      [req.params.id],
      err => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Deleted" });
      }
    );
  });

/* ================= PORTFOLIO ================= */

app.get("/portfolio", (req, res) => {
  db.query(
    "SELECT * FROM portfolio ORDER BY id DESC",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

app.post("/portfolio",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  (req, res) => {

    const { title, description, link } = req.body;

    const image =
      req.file ? `/uploads/${req.file.filename}` : null;

    db.query(
      "INSERT INTO portfolio(title,description,link,image) VALUES(?,?,?,?)",
      [title, description, link, image],
      err => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Portfolio Added" });
      }
    );
  });

/* ================= RESUME ================= */

app.get("/resume", (req, res) => {
  db.query(
    "SELECT * FROM resume LIMIT 1",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0] || { resume_link: "" });
    }
  );
});

app.put("/resume",
  verifyToken,
  verifyAdmin,
  (req, res) => {

    db.query(
      "UPDATE resume SET resume_link=? WHERE id=1",
      [req.body.resume_link],
      err => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Resume Updated" });
      }
    );
  });

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on ${PORT}`)
);