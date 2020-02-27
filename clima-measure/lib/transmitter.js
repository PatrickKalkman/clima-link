/*
 * Sensor responsible for reading the temperature sensor
 */
const mqtt = require('mqtt');

const log = require('./log');
const config = require('./config');

const transmitter = {};

log.info(`Trying to connect to the MQTT broker at ${config.mqttBrokerUrl} on port ${config.mqttBrokerPort}`);

transmitter.connect = function connect(cb) {
  const connectOptions = {
    port: config.mqttBrokerPort,
    host: config.mqttBrokerUrl,
    protocol: 'mqtt',
  };

  transmitter.client = mqtt.connect(connectOptions);

  transmitter.client.on('connect', () => {
    log.info(`Connected successfully to the MQTT broker at ${config.mqttBrokerUrl} on port ${config.mqttBrokerPort}`);

    transmitter.client.subscribe(config.mqttPublishTopic);
    transmitter.client.on('message', (topic, message) => {
      log.info(`incoming message: ${topic} ${message}`);
    });

    cb();
  });
};

transmitter.send = function send(temperature, cb) {
  const message = {
    temperature,
    timeStamp: new Date().toISOString(),
  };
  const stringMessage = JSON.stringify(message);
  transmitter.client.publish(config.mqttPublishTopic, stringMessage, (err) => {
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
