const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import de la configuration de base de données
const connectDB = require('./config/database');

// Import des routes (on les créera étape par étape)
const authRoutes = require('./routes/auth');
// Les autres routes seront importées plus tard
// const projectRoutes = require('./routes/projects');
// const sprintRoutes = require('./routes/sprints');
// const userStoryRoutes = require('./routes/userStories');
// const taskRoutes = require('./routes/tasks');
// const meetingRoutes = require('./routes/meetings');
// const reportRoutes = require('./routes/reports');
// const validationRoutes = require('./routes/validations');
// const dashboardRoutes = require('./routes/dashboard');
// const aiRoutes = require('./routes/ai');

const app = express();

// Connexion à la base de données
connectDB();

// Middleware de sécurité et configuration
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serving static files (créer ces dossiers plus tard)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/reports', express.static(path.join(__dirname, '../reports')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PFE Tracker API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
// On activera ces routes progressivement :
// app.use('/api/projects', projectRoutes);
// app.use('/api/sprints', sprintRoutes);
// app.use('/api/user-stories', userStoryRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/meetings', meetingRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/validations', validationRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/ai', aiRoutes);

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'PFE Tracker API - Version Initiale',
    version: '1.0.0',
    status: '🚀 Authentification active - Développement en cours',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me',
        logout: 'POST /api/auth/logout'
      },
      health: 'GET /health',
      documentation: 'GET /api'
    },
    availableRoles: ['etudiant', 'encadrant_entreprise', 'encadrant_universitaire'],
    nextFeatures: [
      'Gestion des projets (Étape 2)',
      'Gestion des sprints (Étape 3)',
      'User Stories & Tâches (Étape 4)',
      'Système de validation (Étape 5)'
    ]
  });
});

// Route de bienvenue
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur notre application de gestion de PFE ',
    description: 'Système de gestion des projets de fin d\'études',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    documentation: '/api',
    health: '/health'
  });
});

// Middleware pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée`,
    availableEndpoints: {
      api: '/api',
      health: '/health',
      auth: '/api/auth'
    }
  });
});

// Middleware global de gestion d'erreurs
app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur
  console.error('🔥 Error:', err);

  // Erreurs Mongoose
  if (err.name === 'CastError') {
    const message = 'Ressource non trouvée';
    error = { message, statusCode: 404 };
  }

  // Erreurs de validation Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Erreurs de duplication MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} existe déjà`;
    error = { message, statusCode: 400 };
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token invalide';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expiré';
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err.message
    })
  });
});

// Gestion des promesses rejetées non capturées
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`);
  console.log('Shutting down server...');
  server.close(() => {
    process.exit(1);
  });
});

// Gestion des exceptions non capturées
process.on('uncaughtException', (err) => {
  console.log(`❌ Uncaught Exception: ${err.message}`);
  console.log('Shutting down server...');
  process.exit(1);
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`
  🚀 PFE Tracker API démarrée !
  📍 Port: ${PORT}
  🌍 Environnement: ${process.env.NODE_ENV || 'development'}
  📚 Documentation: http://localhost:${PORT}/api
  💓 Health check: http://localhost:${PORT}/health
  
  🎯 Endpoints actifs:
  • Authentification: /api/auth
  • Documentation: /api
  • Health: /health

  📋 Prochaines étapes:
  • Étape 2: Modèles Projet & Sprint
  • Étape 3: CRUD Projects & Sprints
  • Étape 4: User Stories & Tâches
  `);
});

module.exports = app;