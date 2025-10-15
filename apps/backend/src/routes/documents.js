const express = require('express');
const multer = require('multer');
const { z } = require('zod');
const { extractText } = require('../services/ocrService');
const authenticate = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const uploadSchema = z.object({
  purpose: z.enum(['ocr']).default('ocr'),
});

router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }

  const parse = uploadSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid form data', details: parse.error.format() });
  }

  try {
    const text = await extractText(req.file);
    return res.json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to process document' });
  }
});

module.exports = router;
