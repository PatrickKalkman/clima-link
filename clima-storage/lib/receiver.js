/*
 * Sensor responsible for reading the temperature sensor
 */
const mqtt = require('mqtt');

const log = require('./log');
const config = require('./config');
const helper = require('./helpers');

const receiver = {};

receiver.connect = function connect(connectCallback, messageCallback) {
  const connectOptions = {
    port: config.mqtt.port,
    host: config.mqtt.broker,
    rejectUnauthorized: false,
    protocol: 'mqtts',
    username: config.mqtt.username,
    password: config.mqtt.password,
  };

  log.info(`Trying to connect to the MQTT broker at ${config.mqtt.broker} on port ${config.mqtt.port} ${config.mqtt.username}`);

  receiver.client = mqtt.connect(connectOptions);

  receiver.client.on('connect', () => {
    log.info(`Connected successfully to the MQTT broker at ${config.mqtt.broker} on port ${config.mqtt.port}`);

    receiver.client.subscribe(config.mqtt.topic);

    receiver.client.on('message', (topic, message) => {
      if (topic === config.mqtt.topic) {
        const parsedMessage = helper.parseJsonToObject(message.toString());
        messageCallback(parsedMessage);
      }
    });

    connectCallback();
  });

  receiver.client.on('error', (err) => {
    log.error(`An error occurred. ${err}`);
  });
};

receiver.disconnect = function disconnect(cb) {
  receiver.client.end();
  cb();
};

module.exports = receiver;
