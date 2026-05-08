require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { verifyToken } = require('../middleware/auth');
const solanaRoutes = require('../routes/solana');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL;

// Configure CORS to allow only your frontend
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Backend is running' });
});

// Protected route - requires Magic Link DID token
app.get('/api/vault-status', verifyToken, (req, res) => {
  res.json({
    message: `Welcome ${req.user.userId}`,
    userId: req.user.userId,
    walletAddress: req.user.walletAddress
  });
});

app.get('/api/resources', (req, res) => {
  res.json({ message: 'Resources endpoint working!' });
});

// ✅ Solana/Program Routes (Magic Link authenticated)
app.use('/api/program', solanaRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Allowing CORS from: ${FRONTEND_URL}`);
  console.log(`RPC URL: ${process.env.RPC_URL}`);
  console.log(`Program ID: ${process.env.PROGRAM_ID}`);
});