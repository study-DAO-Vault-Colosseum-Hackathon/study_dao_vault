require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const os = require('os');
const path = require('path');
const upload = multer({ dest: 'uploads/' });
const uploadMemory = multer({ storage: multer.memoryStorage() });
const { admin, db } = require('../utils/firebase');
const { storage, appwriteBucketId, buildPublicFileUrl, buildPublicDownloadUrl, publicReadPermissions } = require('../utils/appwrite');
const { ID } = require('node-appwrite');
const { InputFile } = require('node-appwrite/file');
const { verifyToken } = require('../middleware/auth');
const { compressPDF } = require('../utils/pdf-compress');
const votingRouter = require('../routes/voting');
const fs = require('fs');
const fsp = require('fs/promises');

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
app.use('/api/documents', votingRouter);

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

app.listen(PORT, () => {
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

// Upload document: store PDF in Appwrite Storage and metadata in Firestore
app.post('/api/documents/upload', verifyToken, uploadMemory.single('file'), async (req, res) => {
  let tempInputPath;
  let tempOutputPath;
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

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

    // Save buffer to Appwrite Storage with public read permission
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
      type: req.body.type || 'note'
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