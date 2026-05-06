const express = require('express');
const { db } = require('../utils/firebase');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/documents
 * List all documents
 */
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('documents').get();
    const documents = [];
    snapshot.forEach(doc => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    res.json({ count: documents.length, documents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/documents/:id
 * Get single document
 */
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('documents').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/documents/:id/upvote
 */
router.post('/:id/upvote', verifyToken, async (req, res) => {
  try {
    const docId = req.params.id;
    const userId = req.user.uid;

    const docRef = db.collection('documents').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const data = doc.data();
    const votes = data.votes || [];

    // Check if user already voted
    if (votes.some(v => v.userId === userId)) {
      return res.status(400).json({ error: 'You already voted on this document' });
    }

    // Add upvote
    votes.push({ userId, type: 'upvote', timestamp: new Date() });

    // Update document
    await docRef.update({
      upvotes: (data.upvotes || 0) + 1,
      votes: votes
    });

    res.json({ message: 'Upvote recorded', upvotes: (data.upvotes || 0) + 1 });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/documents/:id/downvote
 */
router.post('/:id/downvote', verifyToken, async (req, res) => {
  try {
    const docId = req.params.id;
    const userId = req.user.uid;

    const docRef = db.collection('documents').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const data = doc.data();
    const votes = data.votes || [];

    // Check if user already voted
    if (votes.some(v => v.userId === userId)) {
      return res.status(400).json({ error: 'You already voted on this document' });
    }

    // Add downvote
    votes.push({ userId, type: 'downvote', timestamp: new Date() });

    // Update document
    await docRef.update({
      downvotes: (data.downvotes || 0) + 1,
      votes: votes
    });

    res.json({ message: 'Downvote recorded', downvotes: (data.downvotes || 0) + 1 });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;