var Ruuvitag = require("Ruuvitag");
var eddy = require("ble_eddystone");
//var iBeacon = require("ble_ibeacon");

// The beacon id shown in the app is just the character value of the 9th character in the url (`variables.charCodeAt(8)`, see <https://github.com/ruuvi/weather-station-serverside/blob/master/index.html>), so it can be the value of any valid UTF-8 character.
// To keep the string within valid base64url values, here are the character codes for the base64url alphabet: 45,95 (-,_), 48-57 (0-9), 65-90 (A-Z) and 97-122 (a-z)
var BEACON_ID = 45; 

// Press B to cycle the BEACON_ID 45 -> 127 -> 0
setWatch(function(e) {
  BEACON_ID++;
  if (BEACON_ID >= 128) BEACON_ID = 0;
}, BTN1, {repeat:true, debounce:50, edge:"rising"}); // Trigger when button released

var ruuviUrl;
var envdata;
var refreshIntervalHandle;
var refreshIntervalMillis = 5000;
var advertisingIntervalMillis = 350;

function refresh() {
  blink(LED1, 0.99);
  envdata = Ruuvitag.getEnvData();
  console.log("temp", envdata.temp, "hum", envdata.humidity, "hpa", envdata.pressure, "id", BEACON_ID);
  setAdvertising();
}

function onInit() {
  Ruuvitag.setEnvOn(true);
  refreshIntervalHandle = setInterval(refresh, refreshIntervalMillis);
}

function setAdvertising() {
  var newRuuviUrl = createRuuviUrl(envdata.temp, envdata.humidity, envdata.pressure, BEACON_ID);
  if (!ruuviUrl || ruuviUrl !== newRuuviUrl)
  {
    ruuviUrl = newRuuviUrl;
    console.log(ruuviUrl);
    // http://www.espruino.com/Puck.js+Eddystone
    // http://www.espruino.com/modules/ble_eddystone.js
    // http://www.espruino.com/Reference#l_NRF_setAdvertising
    //eddy.advertise(ruuviUrl);
    NRF.setAdvertising([
        eddy.get(ruuviUrl),
        // iBeacon.get(ruuviUrl) // Uncaught Error: Field or method "uuid" does not already exist, and can't create it on String TODO looky here: http://www.espruino.com/Puck.js+iBeacon
        {
          //0x08: GAP: Shortened local name, shown in nRF connect for this packet (how to set?)
          0x2A00: "EsprSWEddy" // Characteristic: Device name (where visible??) show in nRF connect as "Service Data: UUID: 0x2A00 Data: 0xAABBCCDD...", can be decoded with http://string-functions.com/hex-string.aspx
          //,0x1809: Service: Health Thermometer // this is used in espruino docs for temperature readings
          //,0x2A6E: Characteristic: Temperature
          //,0x2A6D: [Math.round(envdata.pressure)] // Characteristic: Pressure
          ,0x180F: [Math.round(100*NRF.getBattery()/3)] // Service: Battery Service (shows up as percentage in NRF connect but not documented... NRF.getBattery returns volts, 3V is max in this case)
          //,0x2A19 Characteristic: Battery Level (charge level percentage)
          //,0x2A1B Characteristic: Battery Level State (???)
          //,0x2A1A Characteristic: Battery Power State (Present/Discharging/Charging/Level description)
          //,0x2A6C Characteristic: Elevation
        }
      ]
      ,{interval: advertisingIntervalMillis}
    );

    // NOTE off: NRF.setAdvertising({});
  }
}

function blink(led, value) {
  analogWrite(LED2, value, undefined);
  setTimeout(function() { analogWrite(LED2, 1, undefined); }, 100);
}

function createRuuviUrl(temp, humidity, pressure, id) {
  var r_hum = Math.round(humidity/0.5) & 0xff;
  var r_temp = temp & 0xff;
  if (temp < 0) {
    r_temp = ((-temp) | 128) & 0xff;
  }

  var r_pa = Math.round((pressure-500)*100);
  var r_pa2 = (r_pa >>> 0) & 0xff;
  var r_pa1 = (r_pa >>> 8) & 0xff;
  
  var args = [4,r_hum,r_temp,0,r_pa1,r_pa2];
  
  var s = String.fromCharCode.apply(this, args);
  var b = base64url(s);
  b += String.fromCharCode(id);
  b = "ruu.vi/#" + b;
  b = b.substring(0, 17); // Max length for eddy url
  return b;
}

function base64url(binaryString) {
  var b = btoa(binaryString);
  b = translate(b, "+/", "-_"); // base64 -> base64url
  return encodeURIComponent(b); // convert `=` characters to `%3D`
}

function translate(s, sFrom, sTo) {
  translate.out = '';
  for (i = 0; i < s.length; i++) {
    translate.char = s.charAt(i);
    translate.ind = sFrom.indexOf(translate.char);
    if (translate.ind >= 0)
      translate.out += sTo.charAt(translate.ind);
    else
      translate.out += translate.char;
  }
  return translate.out;
}
