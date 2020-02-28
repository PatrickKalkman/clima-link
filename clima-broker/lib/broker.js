/*
 * Sensor responsible for reading the temperature sensor
 */
const fs = require('fs');
const aedes = require('aedes');
const tls = require('tls');

const log = require('./log');
const config = require('./config');

const broker = {};

broker.listen = function connect(cb) {
  broker.aedes = aedes();

  const options = {
    key: fs.readFileSync('broker_private.pem'),
    cert: fs.readFileSync('broker_public.pem'),
  };

  broker.server = tls.createServer(options, broker.aedes.handle);

  log.info(`Starting MQTT broker on port:${config.mqttBrokerPort}`);

  broker.server.listen(config.mqttBrokerPort);

  cb();
};

broker.disconnect = function disconnect(cb) {
  broker.server.aedes.close(() => {
    log.info('Broker is closed');
    cb();
  });
};

broker.authenticate = function authenticate() {
  broker.aedes.authenticate = (client, username, password, cb) => {
    if (
      username &&
      typeof username === 'string' &&
      username === config.mqtt.username &&
      password &&
      typeof password === 'string' &&
      password === config.mqtt.password
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
    // const error = new Error(`Could not authenticate client ${client}`);
    // error.returnCode = 4;
    // cb(error, null);
  };
};

module.exports = broker;
