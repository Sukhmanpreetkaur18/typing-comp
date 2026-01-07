const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./config/logger');
const requestLogger = require('./middleware/requestLogger');

dotenv.config();

require('./config/database');

const app = express();

// Security headers (including CSP) via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://cdn.socket.io",
          "https://cdn.sheetjs.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
        ],
        connectSrc: [
          "'self'",
          "ws://localhost:3000",
          "http://localhost:3000",
          "https://cdn.socket.io",
        ],
        imgSrc: ["'self'", "data:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcAttr: ["'none'"],
      },
    },
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// API Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

logger.info('✓ Express app initialized');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/export', require('./routes/export'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api', require('./routes/competition'));

// Static files
app.use(express.static(path.join(__dirname, './public')));

// ✅ NEW: Loader middleware for specific pages
app.use((req, res, next) => {
  // Skip loader for API routes and static assets
  if (req.path.startsWith('/api') || 
      req.path.startsWith('/static') || 
      req.path.includes('.') ||
      req.path === '/loader') {
    return next();
  }
  
  // Check if it's a main page that should show loader
  const mainPages = ['/', '/participant', '/organizer', '/analytics'];
  
  // If user is coming from loader or it's not a main page, skip loader
  if (req.query.fromLoader || !mainPages.includes(req.path)) {
    return next();
  }
  
  // Check if user has already seen loader in this session
  if (req.session && req.session.hasSeenLoader) {
    return next();
  }
  
  // Redirect to loader with the intended destination
  const redirectUrl = `${req.path}${Object.keys(req.query).length ? '?' + new URLSearchParams(req.query).toString() : ''}`;
  res.redirect(`/loader?redirect=${encodeURIComponent(redirectUrl)}`);
});

// ✅ NEW: Loader route
app.get('/loader', (req, res) => {
  // Set session flag to indicate loader has been shown
  if (req.session) {
    req.session.hasSeenLoader = true;
  }
  res.sendFile(path.join(__dirname, './public/loader.html'));
});

// Fallback routes with query parameter to skip loader
app.get('/participant', (req, res) => {
  res.sendFile(path.join(__dirname, './public/participant.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/organizer', (req, res) => {
  res.sendFile(path.join(__dirname, './public/organizer.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, './public/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, './public/register.html'));
});

app.get('/analytics', (req, res) => {
  res.sendFile(path.join(__dirname, './public/analytics.html'));
});

module.exports = app;