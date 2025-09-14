const express = require("express");
const app = express();
// Load environment variables at the very top
require("dotenv").config({ path: "./config.env" });
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const multer = require("multer");
const path = require("path");

// Import organized routes
const authRoutes = require("./routes/login");
const signupRoutes = require("./routes/signup");
const logoutRoutes = require("./routes/logout");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/posts");

// Import middleware
const { setAuthStatus } = require("./middleware/auth");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const connectDB = require("./db/db");

// =================== CORS Setup ===================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://mitronet.onrender.com",
    ], // React dev server
    credentials: true,
  })
);

// =================== JSON parsing ===================
app.use(express.json());

// =================== Multer Setup ===================
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads")); // Ensure uploads folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

app.use(express.urlencoded({ extended: true })); // parse form data
app.use(multer({ storage, fileFilter }).single("profileImage")); // handle image upload

// =================== Static Files ===================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/profile", express.static(path.join(__dirname, "uploads")));

// =================== Database Connection ===================
const port = 3000;
// mongoose
//   .connect("mongodb://localhost:27017/jwtDemo")
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error(err))

// =================== Session Setup ===================
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false, // Changed to false to avoid creating empty sessions
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://kunalkumar30singh_db_user:15dvYa28TjW2vBGy@cluster0.j1ilnvm.mongodb.net/social", // Added database name
      collectionName: "sessions", // collection name
      ttl: 14 * 24 * 60 * 60, // 14 days in seconds
      touchAfter: 24 * 3600, // lazy session update
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14, // optional: 14 days in milliseconds
      httpOnly: true, // Added for security
      secure: false, // Set to true in production with HTTPS
    },
  })
);

// Set authentication status for all requests
app.use(setAuthStatus);

// Add session debugging middleware
app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session Data:", req.session);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// =================== Routes ===================
// Authentication routes
app.use("/signup", signupRoutes);
app.use("/login", authRoutes);
app.use("/logout", logoutRoutes);

// User routes (profile, connections, etc.)
app.use("/", userRoutes);

// Post routes (posts, comments, likes, etc.)
app.use("/", postRoutes);

// =================== Error Handling ===================
// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// =================== Start Server ===================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  connectDB();
});
