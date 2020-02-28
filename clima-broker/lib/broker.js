/*
 * Sensor responsible for reading the temperature sensor
 */
const fs = require('fs');
const aedes = require('aedes');
const tls = require('tls');

const log = require('./log');
const config = require('./config');

const broker = {};

broker.listen = function listen(cb) {
  broker.aedes = aedes();

  const options = {
    key: fs.readFileSync('./certificates/broker-private.pem'),
    cert: fs.readFileSync('./certificates/broker-public.pem'),
  };

  broker.server = tls.createServer(options, broker.aedes.handle);

  log.info(`Starting MQTT broker on port:${config.mqtt.port}`);

  broker.server.listen(config.mqtt.port);

  cb();
};

broker.close = function close(cb) {
  broker.aedes.close(() => {
    log.info('Broker is closed');
    cb();
  });
};

broker.setupAuthentication = function setupAuthentication() {
  broker.aedes.authenticate = (client, username, password, cb) => {
    if (username && typeof username === 'string' && username === config.mqtt.username) {
      if (password && typeof password === 'object' && password.toString() === config.mqtt.password) {
        cb(null, true);
        log.info('authenticated successfully');
      }
    } else {
      cb(false, false);
    }
    // const error = new Error(`Could not authenticate client ${client}`);
    // error.returnCode = 4;
    // cb(error, null);
  };
};

module.exports = broker;
