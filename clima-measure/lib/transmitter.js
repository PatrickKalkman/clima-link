/*
 * Sensor responsible for reading the temperature sensor
 */
const mqtt = require('mqtt');
const moment = require('moment');

const log = require('./log');
const config = require('./config');

const transmitter = {};

transmitter.connect = function connect(cb) {
  const connectOptions = {
    port: config.mqtt.port,
    host: config.mqtt.broker,
    rejectUnauthorized: false,
    protocol: 'mqtts',
    username: config.mqtt.username,
    password: config.mqtt.password,
  };

  log.info(`Trying to connect to the MQTT broker at ${config.mqtt.broker} on port ${config.mqtt.port}`);

  transmitter.client = mqtt.connect(connectOptions);

  transmitter.client.on('connect', () => {
    log.info(`Connected successfully to the MQTT broker at ${config.mqtt.broker} on port ${config.mqtt.port}`);
    cb();
  });

  transmitter.client.on('error', (err) => {
    log.error(`An error occurred. ${err}`);
  });
};

transmitter.send = function send(temperature, cb) {
  const message = {
    temperature,
    timeStamp: moment().unix(),
  };

  transmitter.client.publish(config.mqtt.topic, JSON.stringify(message), (err) => {
    if (err) {
      log.error(`An error occurred while trying to publish a message. Err: ${err}`);
    } else {
      log.debug('Successfully published message');
    }
    cb(err);
  });
};

transmitter.disconnect = function disconnect(cb) {
  transmitter.client.end();
  cb();
};

module.exports = transmitter;
