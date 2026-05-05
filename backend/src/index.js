try {
  require('dotenv').config();
} catch (e) {
  console.warn('dotenv not installed; continuing without .env file');
}
const express = require('express');
const cors = require('cors');
const { verifyToken } = require('../middleware/auth');
const authRoutes = require('../routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || (NODE_ENV === 'development' ? 'http://localhost:5173' : undefined);

// Configure CORS to allow only your frontend
const corsOptions = {
  origin: FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Backend is running' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Protected route - requires Firebase token
app.get('/api/vault-status', verifyToken, (req, res) => {
  res.json({
    message: `Welcome ${req.user.email}`,
    userId: req.user.uid
  });
});

app.get('/api/resources', (req, res) => {
  res.json({ message: 'Resources endpoint working!' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Allowing CORS from: ${FRONTEND_URL}`);
});