function btoa(str) { return Buffer.from(str, 'ascii').toString('base64'); }
function atob(b64encoded) { return Buffer.from(b64Encoded, 'base64').toString(); }
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
console.log(createRuuviUrl(0,0,0,45));
