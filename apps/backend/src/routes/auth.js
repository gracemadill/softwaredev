const express = require('express');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const config = require('../config');

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

router.post('/login', (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid request', details: parse.error.format() });
  }

  const { email, password } = parse.data;
  if (email !== config.adminEmail || password !== config.adminPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ email }, config.authSecret, { expiresIn: '12h' });
  return res.json({ token });
});

module.exports = router;
