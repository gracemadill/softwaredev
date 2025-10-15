const app = require('./app');
const config = require('./config');
const { log } = require('./utils/logger');

app.listen(config.port, () => {
  log(`API listening on port ${config.port}`);
});
