/*
 * Primary file for the Workflow Engine
 */

// Dependencies
const process = require('process');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();

const config = require('./lib/config');
const log = require('./lib/log');
const storage = require('./lib/storage');
const receiver = require('./lib/receiver');

const app = {};

app.init = function init() {
  log.info('Started climate measurement, start reading sensor data');

  storage.connect(() => {

  });

  receiver.connect(
    () => { log.info('Successfully connected to the mqtt broker'); },
    (message) => {

      storage.save(message, (err) => {
        if (err) {
          log.error(`An error occurred while trying to store the incoming message. ${err}`);
        }
      });
    },
  );
};

app.shutdown = function shutdown() {
  clearInterval(app.intervalTimer);
  receiver.disconnect(() => {
    process.exit();
  });
};

process.on('SIGINT', () => {
  log.info('Got SIGINT, gracefully shutting down');
  app.shutdown();
});

process.on('SIGTERM', () => {
  log.info('Got SIGTERM, gracefully shutting down');
  app.shutdown();
});

app.init();

module.exports = app;
