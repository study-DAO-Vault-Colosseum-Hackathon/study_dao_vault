require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { verifyToken } = require('../middleware/auth');
const supabase = require('../supabase/supabaseClient');
const checkSupabase = require('../supabase/supabasedb');

checkSupabase();
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { 
  cors: { 
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  } 
});
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL;
const router = express.Router();
// Configure CORS to allow only your frontend
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.set('view engine', 'ejs');

app.get('/home', (req, res) => {
  res.render('home')
})

// app.get('/notes', async (req, res) => {
//   const { data, error } = await supabase
//     .from('notes')
//     // .insert([{ title: "title", description: "description", images: "image1" }])
//     .select('*');

//   if (error) {
//     return res.status(400).json({ error: error.message });
//   }

//   return res.json(data);
// });

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Backend is running' });
});

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

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Allowing CORS from: ${FRONTEND_URL}`);
});


io.on('connection', (socket) => {
  console.log('User connected : ', socket.id);

  socket.on('message', (data) => {
    console.log(data);
    socket.broadcast.emit('message', data);
  })

  socket.on('vault_update', (data  ) => {
    console.log('Vault update received:', data);
    socket.broadcast.emit('vault_update', data);
  })

  socket.on('disconnect', () => {
    console.log('user A disconnected id : ', socket.id);
  })
})

module.exports = router;