require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const { globalLimiter } = require('./src/middleware/rateLimit');
const { errorHandler } = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/auth');
const catalogRoutes = require('./src/routes/catalog');
const cartRoutes = require('./src/routes/cart');
const orderRoutes = require('./src/routes/orders');
const adminRoutes = require('./src/routes/admin');

// Auto-initialize database (migrate + seed) on startup
try {
  require('./src/migrations/001_init');
  require('./src/migrations/002_seed');
  console.log('[PHANTOM] Database auto-initialized');
} catch (err) {
  console.error('[PHANTOM] DB init failed:', err && err.message);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Rate limiting (global)
app.use(globalLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// 404 for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Эндпоинт не найден' });
});

// Serve static frontend (optional: if frontend is in the same repo)
const frontendPath = path.resolve(__dirname, '..');
app.use(express.static(frontendPath));

// SPA fallback for frontend pages
app.get('/pages/*', (req, res) => {
  const page = req.path.replace('/pages/', '');
  res.sendFile(path.join(frontendPath, 'pages', page));
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[PHANTOM] Backend running on port ${PORT}`);
  console.log(`[PHANTOM] API: http://localhost:${PORT}/api`);
  console.log(`[PHANTOM] Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
