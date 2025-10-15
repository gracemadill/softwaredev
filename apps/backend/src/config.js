const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), 'storage');
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

module.exports = {
  port: Number(process.env.PORT || 4000),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '*')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  openAiApiKey: process.env.OPENAI_API_KEY,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  authSecret: process.env.AUTH_SECRET || 'change-me',
  storageDir: STORAGE_DIR,
  ocrScriptPath: path.join(__dirname, '..', 'ocr', 'ocr_pdf.py'),
};
