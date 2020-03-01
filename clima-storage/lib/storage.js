/*
 * Sensor responsible for reading the temperature sensor
 */
const Influx = require('influx');
const config = require('./config');
const log = require('./log');

const storage = {};

storage.connect = function connect(cb) {
  storage.influx = new Influx.InfluxDB({
    host: 'localhost',
    database: config.database.name,
    username: config.database.user,
    password: config.database.password,
    schema: [
      {
        measurement: 'temperature',
        fields: {
          temperature: Influx.FieldType.FLOAT,
        },
        tags: ['host'],
      },
    ],
  });

  storage.influx.getDatabaseNames().then((names) => {
    if (!names.includes(config.database.name)) {
      return storage.influx.createDatabase(config.database.name);
    }
    return null;
  }).then(cb);
};

storage.save = function save(message, cb) {
  log.info(`message: ${message.timeStamp} ${message.temperature}`);
  storage.influx.writePoints([
    {
      measurement: 'temperature',
      fields: {
        temperature: message.temperature,
      },
      tags: { host: 'test' },
      timestamp: message.timeStamp,
    },
  ]).then(cb);
};

storage.disconnect = function disconnect(cb) {
  cb();
};

module.exports = storage;
