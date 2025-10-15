#!/usr/bin/env node
const { spawn } = require('child_process');

function run(command, args, name) {
  const proc = spawn(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  proc.on('close', (code) => {
    if (code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
      process.exit(code);
    }
  });
  return proc;
}

const backend = run('npm', ['run', 'dev', '--workspace', '@easy-read/backend'], 'backend');
const frontend = run('npm', ['run', 'dev', '--workspace', '@easy-read/frontend'], 'frontend');

function shutdown(signal) {
  if (backend) backend.kill(signal);
  if (frontend) frontend.kill(signal);
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
