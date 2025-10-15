const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { randomUUID } = require('crypto');
const config = require('../config');
const { error, log } = require('../utils/logger');

async function runOcrScript(tempFile) {
  return new Promise((resolve, reject) => {
    const python = spawn('python3', [config.ocrScriptPath, '--input', tempFile]);
    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    python.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        error('OCR script failed', code, stderr);
        return reject(new Error('OCR script failed'));
      }
      try {
        const payload = JSON.parse(stdout || '{}');
        if (payload.error) {
          return reject(new Error(payload.error));
        }
        return resolve(payload.text || '');
      } catch (err) {
        error('Failed to parse OCR output', stdout, err);
        return reject(new Error('Failed to parse OCR output'));
      }
    });
  });
}

async function extractText(file) {
  const extension = path.extname(file.originalname || '').toLowerCase();
  const safeName = `${randomUUID()}${extension || '.bin'}`;
  const tempFile = path.join(os.tmpdir(), safeName);
  await fs.promises.writeFile(tempFile, file.buffer);
  try {
    const text = await runOcrScript(tempFile);
    if (config.storageDir) {
      const storedPath = path.join(config.storageDir, safeName);
      await fs.promises.copyFile(tempFile, storedPath);
      log('Stored uploaded file at', storedPath);
    }
    return text.trim();
  } finally {
    await fs.promises.unlink(tempFile).catch(() => {});
  }
}

module.exports = { extractText };
