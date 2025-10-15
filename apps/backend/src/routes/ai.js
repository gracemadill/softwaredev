const express = require('express');
const authenticate = require('../middleware/auth');
const { rewrite, translate } = require('../services/aiService');

const router = express.Router();

router.post('/rewrite', authenticate, async (req, res) => {
  try {
    const result = await rewrite(req.body);
    return res.json({ text: result });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.post('/translate', authenticate, async (req, res) => {
  try {
    const result = await translate(req.body);
    return res.json({ text: result });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
