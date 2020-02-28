/*
 * Primary file for the Workflow Engine
 */

// Dependencies
const process = require('process');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();

const config = require('./lib/config');
const log = require('./lib/log');

const app = {};

app.init = function init() {
  log.info('Started mqtt broker');
  app.notifyStatus();
};

app.notifyStatus = function notifyStatus() {
  log.info('MQTT Broker running...');

  app.intervalTimer = setTimeout(() => {
    app.notifyStatus();
  }, config.measurement.readInterval * 1000);
};

app.shutdown = function shutdown() {
  clearInterval(app.intervalTimer);
  process.exit();
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
