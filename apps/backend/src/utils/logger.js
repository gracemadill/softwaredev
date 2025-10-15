function log(...args) {
  if (process.env.NODE_ENV !== 'test') {
    console.log('[backend]', ...args);
  }
}

function error(...args) {
  if (process.env.NODE_ENV !== 'test') {
    console.error('[backend]', ...args);
  }
}

module.exports = { log, error };
