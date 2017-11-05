var LED1 = "LED1";
var LED2 = "LED2";
var BTN1 = "BTN1";
var BTN2 = "BTN2";

// Modules: http://www.espruino.com/modules/

function setWatch(callback, pin, options) {
  // TODO impl for BTN1 = B, BTN2 = R
  // https://stackoverflow.com/questions/23317504/nodejs-keydown-keyup-events  
}

function analogWrite(pin, value, options) {
  console.log(`[ESPRUINO] analogWrite(${pin}, ${value}, ${options})`);
}

// TODO does this add a new Buffer object to heap each time? Could do it without buffers?
function btoa(str) { return Buffer.from(str, 'ascii').toString('base64'); }
function atob(b64encoded) { return Buffer.from(b64Encoded, 'base64').toString(); }
