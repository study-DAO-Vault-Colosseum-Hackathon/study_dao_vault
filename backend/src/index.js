try {
  require('dotenv').config();
} catch (e) {
  console.warn('dotenv not installed; continuing without .env file');
}
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const os = require('os');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const { verifyToken } = require('../middleware/auth');
const authRoutes = require('../routes/auth');
const { admin, db, firebaseInitialized } = require('../utils/firebase');
const { storage, appwriteBucketId, buildPublicFileUrl, buildPublicDownloadUrl, publicReadPermissions } = require('../utils/appwrite');
const { ID } = require('node-appwrite');
const { InputFile } = require('node-appwrite/file');
const { compressPDF } = require('../utils/pdf-compress');
const votingRouter = require('../routes/voting');

const upload = multer({ dest: 'uploads/' });
const uploadMemory = multer({ storage: multer.memoryStorage() });

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Allow multiple frontend URLs in development
let corsOrigin;
if (NODE_ENV === 'development') {
  corsOrigin = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:3000'];
} else {
  corsOrigin = process.env.FRONTEND_URL || '*';
}

// Configure CORS to allow frontend
const corsOptions = {
  origin: corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/documents', votingRouter);

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

app.post('/api/compress-pdf', upload.single('pdf'), async (req, res) => {
  const inputPath = req.file?.path;
  if (!inputPath) {
    return res.status(400).json({ error: 'No PDF uploaded' });
  }

  const outputPath = `uploads/compressed-${req.file.filename}.pdf`;
  try {
    const quality = req.body?.quality || 'screen';
    const result = await compressPDF(inputPath, outputPath, quality);
    res.setHeader('X-Original-Bytes', String(result.originalBytes));
    res.setHeader('X-Compressed-Bytes', String(result.compressedBytes));
    res.setHeader('X-Compression-Used', String(result.usedCompressed));
    res.download(outputPath, 'compressed.pdf', () => {
      fs.unlink(inputPath, () => {});
      fs.unlink(outputPath, () => {});
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload document: store file in Appwrite Storage and metadata in Firestore
app.post('/api/documents/upload', verifyToken, uploadMemory.single('file'), async (req, res) => {
  let tempInputPath;
  let tempOutputPath;

  try {
    if (!firebaseInitialized) {
      return res.status(503).json({ error: 'Firebase not initialized' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');
    let uploadBuffer = req.file.buffer;
    let uploadMimeType = req.file.mimetype;
    let uploadFileName = req.file.originalname;
    let compressionInfo = {
      wasCompressed: false,
      originalBytes: req.file.size,
      uploadedBytes: req.file.size,
      savedPercent: 0,
    };

    if (isPdf) {
      const tempDir = os.tmpdir();
      const filePrefix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      tempInputPath = path.join(tempDir, `${filePrefix}-input.pdf`);
      tempOutputPath = path.join(tempDir, `${filePrefix}-output.pdf`);

      await fsp.writeFile(tempInputPath, req.file.buffer);
      const compressResult = await compressPDF(tempInputPath, tempOutputPath, 'screen');
      uploadBuffer = await fsp.readFile(tempOutputPath);
      uploadMimeType = 'application/pdf';
      uploadFileName = req.file.originalname.toLowerCase().endsWith('.pdf')
        ? req.file.originalname
        : `${req.file.originalname}.pdf`;

      compressionInfo = {
        wasCompressed: compressResult.usedCompressed,
        originalBytes: compressResult.originalBytes,
        uploadedBytes: compressResult.compressedBytes,
        savedPercent: compressResult.originalBytes > 0
          ? Number((((compressResult.originalBytes - compressResult.compressedBytes) / compressResult.originalBytes) * 100).toFixed(2))
          : 0,
      };
    }

    const filename = `documents/${req.user.uid}/${Date.now()}_${uploadFileName}`;
    const fileId = ID.unique();
    const inputFile = InputFile.fromBuffer(uploadBuffer, filename, uploadMimeType);

    await storage.createFile(appwriteBucketId, fileId, inputFile, publicReadPermissions);
    await storage.updateFile(appwriteBucketId, fileId, filename, publicReadPermissions);

    const fileUrl = buildPublicFileUrl(fileId);
    const downloadUrl = buildPublicDownloadUrl(fileId);

    const docData = {
      title: req.body.title || '',
      course: req.body.course || '',
      semester: req.body.semester || '',
      subject: req.body.subject || '',
      fileName: uploadFileName,
      filePath: filename,
      fileId,
      fileUrl,
      downloadUrl,
      mimeType: uploadMimeType,
      ...compressionInfo,
      owner: { uid: req.user.uid, email: req.user.email || null },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      upvotes: 0,
      downvotes: 0,
      votes: [],
      type: req.body.type || 'note',
    };

    const docRef = await db.collection('documents').add(docData);
    res.json({ id: docRef.id, ...docData });
  } catch (err) {
    console.error('Upload error', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (tempInputPath) {
      await fsp.unlink(tempInputPath).catch(() => {});
    }
    if (tempOutputPath) {
      await fsp.unlink(tempOutputPath).catch(() => {});
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});

// Handle errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});