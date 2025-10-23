const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const sprintRoutes = require("./routes/sprints");

const app = express();

connectDB();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/reports", express.static(path.join(__dirname, "../reports")));

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({
      success: true,
      message: "PFE Tracker API is running",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/sprints", sprintRoutes);

app.get("/api", (req, res) => {
  res.json({
    message: "PFE Tracker API - Version Initiale",
    version: "1.0.0",
    status: "Authentification active - Développement en cours",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        profile: "GET /api/auth/me",
        logout: "POST /api/auth/logout",
      },
      health: "GET /health",
      documentation: "GET /api",
    },
    availableRoles: [
      "etudiant",
      "encadrant_entreprise",
      "encadrant_universitaire",
    ],
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur notre application de gestion de PFE ",
    description: "Système de gestion des projets de fin d'études",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    documentation: "/api",
    health: "/health",
  });
});

app.use((req, res) => {
  res
    .status(404)
    .json({
      success: false,
      message: `Route ${req.originalUrl} non trouvée`,
      availableEndpoints: { api: "/api", health: "/health", auth: "/api/auth" },
    });
});

app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.error("Error:", err);
  if (err.name === "CastError") {
    error = { message: "Ressource non trouvée", statusCode: 404 };
  }
  if (err.name === "ValidationError") {
    error = {
      message: Object.values(err.errors)
        .map((val) => val.message)
        .join(", "),
      statusCode: 400,
    };
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = { message: `${field} existe déjà`, statusCode: 400 };
  }
  if (err.name === "JsonWebTokenError") {
    error = { message: "Token invalide", statusCode: 401 };
  }
  if (err.name === "TokenExpiredError") {
    error = { message: "Token expiré", statusCode: 401 };
  }
  res
    .status(error.statusCode || 500)
    .json({
      success: false,
      message: error.message || "Erreur serveur interne",
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
        error: err.message,
      }),
    });
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  console.log("Shutting down server...");
  server.close(() => {
    process.exit(1);
  });
});
process.on("uncaughtException", (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  console.log("Shutting down server...");
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`PFE Tracker API démarrée ! Port: ${PORT}`);
});

module.exports = app;
