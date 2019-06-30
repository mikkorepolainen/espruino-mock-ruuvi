// NOTE pins on RuuviTag USED TO BE inverted (0 = ON, 1 = OFF), now:
// 1 = ON
// 0 = OFF
// edge: rising, falling or both (default)
//   rising = button pressed
//   falling = button released
// e.lastTime: not dependent on specified edge, it's the last time of event on button regardless of direction
// http://www.espruino.com/Reference#l__global_setWatch

var led2state = 0;
var lastPressedTime;

setWatch(function(e) { // Button pressed (repeat)
  lastPressedTime = e.time;
  console.log("watching for release");
  setWatch(function(e) { // Button released (once)
    if (e.time-lastPressedTime > 1) { // Toggle on/off on long press
      if (led2state <= 0) led2state = 1;
      else led2state = 0;
      console.log("released (long)", led2state);
    } else { // Dim on short press
      if (led2state > 0.15)  led2state -= 0.1; // having led2state > 0.1 jumps right to zero
      else led2state -= 0.01;
      if (led2state < 0) led2state = 0;
      console.log("released (short)", led2state);
    }
    analogWrite(LED2, led2state, undefined);
  }, BTN1, {repeat:false, debounce:25, edge:"falling"});
}, BTN1, {repeat:true, debounce:25, edge:"rising"});
