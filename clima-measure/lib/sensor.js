/*
 * Sensor responsible for reading the temperature sensor
 */
const tempSensor = require('ds18b20-raspi');

const log = require('./log');
const config = require('./config');
const constants = require('./constants');

const sensor = {};

sensor.read = function read(cb) {
  if (config.envName === constants.ENVIRONMENTS.PRODUCTION) {
    // Read the temperature from the sensor
    tempSensor.readSimpleC((err, temp) => {
      if (!err) {
        cb(null, temp);
      } else {
        log.error(`An error occurred while trying to read the temperature sensor. ${err}`);
        cb(err);
      }
    });
  } else {
    // Generate a fake temperature for testing
    const temperature = Math.floor(Math.random() * 20);
    cb(null, temperature);
  }
};

module.exports = sensor;
