try {
  require('dotenv').config();
} catch (e) {
  console.warn('dotenv not installed; continuing without .env file');
}
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const uploadMemory = multer({ storage: multer.memoryStorage() });
const { admin, db } = require('../utils/firebase');
const { verifyToken } = require('../middleware/auth');
const authRoutes = require('../routes/auth');

const { compressPDF } = require('../utils/pdf-compress');
const votingRouter = require('../routes/voting');
const usersRouter = require('../routes/auth');
const fs = require('fs');
const supabase = require('../supabase/supabaseClient');
const checkSupabase = require('../supabase/supabasedb');
const path = require('path');
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
const FRONTEND_URL = process.env.FRONTEND_URL || (NODE_ENV === 'development' ? 'http://localhost:5173' : undefined);

const router = express.Router();
// const userRoute = require('../routes/auth');
const userRoute = require('../routes/auth');
// Configure CORS to allow only your frontend
const corsOptions = {
  origin: FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/documents', votingRouter);
// console.log("DEBUG: The handler on line 41 is:", userRoute);
app.use('/api/users', userRoute);

app.set('view engine', 'ejs');

app.get('/home', (req, res) => {
  res.render('home')
})
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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

// Auth routes
app.use('/api/auth', authRoutes);

// app.get('/api/users', (req, res)=>{
//   res.json({ok : true, message:"user endpoint"});
// })
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

app.post('/api/compress-pdf', upload.single('pdf'), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `uploads/compressed-${req.file.filename}.pdf`;
  try {
    const quality = req.body?.quality || 'screen';
    const result = await compressPDF(inputPath, outputPath, quality);
    res.setHeader('X-Original-Bytes', String(result.originalBytes));
    res.setHeader('X-Compressed-Bytes', String(result.compressedBytes));
    res.setHeader('X-Compression-Used', String(result.usedCompressed));
    res.download(outputPath, 'compressed.pdf', () => {
      // Optional: clean up files after sending
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload document: store PDF in Firebase Storage and metadata in Firestore
app.post('/api/documents/upload', verifyToken, uploadMemory.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const bucket = admin.storage().bucket();
    const filename = `documents/${req.user.uid}/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(filename);

    // Save buffer to storage
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
      resumable: false
    });

    // Create signed URL
    const [signedUrl] = await file.getSignedUrl({ action: 'read', expires: '03-01-2500' });

    const docData = {
      title: req.body.title || '',
      course: req.body.course || '',
      semester: req.body.semester || '',
      subject: req.body.subject || '',
      fileName: req.file.originalname,
      filePath: filename,
      fileUrl: signedUrl,
      owner: { uid: req.user.uid, email: req.user.email || null },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      upvotes: 0,
      downvotes: 0,
      votes: [],
      type: req.body.type || 'note'
    };

    const docRef = await db.collection('documents').add(docData);
    res.json({ id: docRef.id, ...docData });
  } catch (err) {
    console.error('Upload error', err);
    res.status(500).json({ error: err.message });
  }
});

// additional work


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