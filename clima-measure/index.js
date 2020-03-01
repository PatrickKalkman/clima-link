/*
 * Primary file for the Workflow Engine
 */

// Dependencies
const process = require('process');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();

const config = require('./lib/config');
const log = require('./lib/log');
const sensor = require('./lib/sensor');
const transmitter = require('./lib/transmitter');

const app = {};

app.init = function init() {
  log.info('Started climate measurement, start reading sensor data');
  transmitter.connect(() => {
    app.intervalTimer = setTimeout(() => {
      app.measureAndSend();
    });
  });
};

app.measureAndSend = function measureAndSend() {
  sensor.read((senorErr, measurement) => {
    if (!senorErr) {
      transmitter.send(measurement, (transmitErr) => {
        if (transmitErr) {
          log.error(`An error occurred while publishing the measurement. Err: ${transmitErr}`);
        } else {
          log.info('Successfully send message to mqtt broker');
        }
      });
    } else {
      log.error(`An error occurred while trying to read the sensor. Err: ${senorErr}`);
    }

    app.intervalTimer = setTimeout(() => {
      app.measureAndSend();
    }, config.measurement.readInterval * 1000);
  });
};

app.shutdown = function shutdown() {
  clearInterval(app.intervalTimer);
  transmitter.disconnect(() => {
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
