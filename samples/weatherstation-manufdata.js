var Ruuvitag = require("Ruuvitag");

var envdata;
var acceldata;
var refreshIntervalHandle;
var refreshIntervalMillis = 5000;
var advertisingIntervalMillis = 375; // default 375
var changed = true;

function refresh() {
  blink(LED1, 0.05);
  envdata = Ruuvitag.getEnvData(); // { "temp": 27.11632439764, "pressure": 1002.19922678033, "humidity": 45.1416015625 }
  acceldata = Ruuvitag.getAccelData(); // { "x": 27.34375, "y": -42.96875, "z": 1031.25, "new": true }
  console.log("env", envdata, "accel", acceldata);
  setAdvertising();
}

function onInit() {
  Ruuvitag.setEnvOn(true);
  Ruuvitag.setAccelOn(true);
  refreshIntervalHandle = setInterval(refresh, refreshIntervalMillis);
}

function setAdvertising() {
  if (changed && envdata && acceldata)
  {
    // http://www.espruino.com/Reference#l_NRF_setAdvertising
    // Manufacturer specific data http://forum.espruino.com/conversations/298200/
    NRF.setAdvertising({},
      {
        showName: false,
        manufacturer: 0x0499,
        manufacturerData: createRuuviManufdata(envdata.temp, envdata.humidity, envdata.pressure, acceldata.x, acceldata.y, acceldata.z),
        interval: advertisingIntervalMillis
      }
    );

    // NOTE off: NRF.setAdvertising({});
  }
}

function createRuuviManufdata(temp, humidity, pressure, accelx, accely, accelz) {
  var r_hum = Math.round(humidity/0.5) & 0xff;
  var r_temp = temp & 0xff;
  if (temp < 0) {
    r_temp = ((-temp) | 128) & 0xff;
  }
  //console.log((rtemp >>> 0).toString(2));
  //TODO temp fraction

  var r_pa = Math.round((pressure-500)*100);
  //console.log(r_pa);
  var r_pa2 = (r_pa >>> 0) & 0xff;
  var r_pa1 = (r_pa >>> 8) & 0xff;
  //var r_pa_ = r_pa2 | (r_pa1 << 8);
  //console.log((r_pa >>> 0).toString(2));
  //console.log((r_pa1 >>> 0).toString(2) + " " + (r_pa2 >>> 0).toString(2));
  //console.log((r_pa_ >>> 0).toString(2));

  var x = decimalTo2bytes(accelx);
  var y = decimalTo2bytes(accely);
  var z = decimalTo2bytes(accelz);
  var batt = decimalTo2bytes(NRF.getBattery()/1000);

  // TODO RAWv2
  return [0x03, // Data format definition (3 = RAWv1)
          r_hum, // Humidity (one lsb is 0.5%, e.g. 128 is 64%)
          r_temp, // Temperature (MSb is sign, next 7 bits are decimal value)
          0x99, // Temperature (fraction, 1/100.)
          r_pa1, r_pa2, // Pressure (MSB first, value - 50kPa)
          x[0], x[1], // Acceleration-X (MSB first)
          y[0], y[1], // Acceleration-Y (MSB first)
          z[0], z[1], // Acceleration-Z (MSB first)
          batt[0], batt[1] // Battery voltage (millivolts, MSB First)
        ];
}

function decimalTo2bytes(dec) {
  var f = parseFloat(dec.toFixed(2)) * 100;
  if (decimalTo2bytes.buf === undefined) decimalTo2bytes.buf = new Uint8Array(2);
  decimalTo2bytes.buf[0] = f & 0xff;
  decimalTo2bytes.buf[1] = f >> 8 & 0xff;
  return decimalTo2bytes.buf;
}

function blink(led, value) {
  analogWrite(led, value, undefined);
  setTimeout(function() { analogWrite(led, 0, undefined); }, 100);
}
