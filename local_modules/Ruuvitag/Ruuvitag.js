// https://www.espruino.com/Ruuvitag

let values = {
  envOn: false,
  accelOn: false,

  env: { temp: 0, humidity: 0, pressure: 0 },
  accel: { x: 0, y: 0, z: 0 }
};
exports.values = values;

// Set whether the environmental sensor is on or off
exports.setEnvOn = function (on) { values.envOn = on; }

/* Set whether the accelerometer is on or off. A callback can be supplied
  which will be called with an {x,y,z} argument
*/
exports.setAccelOn = function (on, callback) {
    values.accelOn = on;
    if (callback) {
      setInterval(function() {
        callback(values.accel);
      }, 1000);
    }
};

// Get the last received environment data { temp: degrees_c, pressure: kPa, humidity: % }
exports.getEnvData = function() {
    if (!values.envOn) return undefined;
    return values.env;
};

// Get the last received accelerometer data, or undefined
exports.getAccelData = function () {
  if (!values.accelOn) return undefined;
  return values.accel;
};
