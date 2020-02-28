/*
 * Sensor responsible for reading the temperature sensor
 */
const Influx = require('influx');

const log = require('./log');
const config = require('./config');

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
  storage.influx.writePoints([
    {
      measurement: 'temperature',
      fields: {
        temperature: message.temperature,
      },
      timestamp: message.timeStamp,
    },
  ]).then(cb);
};

storage.disconnect = function disconnect(cb) {};

module.exports = storage;
