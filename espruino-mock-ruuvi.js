#!/usr/bin/env node
var file = process.argv[2];
if (!file) {
  console.log("Usage: node test.js FILE");
  process.exit(0);
}

var fs = require('fs');
var path = require('path');
eval(fs.readFileSync(path.join(__dirname, 'espruino.js')).toString());
eval(fs.readFileSync(path.join(__dirname, 'NRF.js')).toString());
eval(fs.readFileSync(file).toString());
if (onInit) setTimeout(function() {
  console.log("[ONINIT]");
  onInit();
}, 5000);
var memoryUsageInitial = process.memoryUsage();
var memoryUsageLast = memoryUsageInitial;
function formatmem(memBytes) {
  return `${Math.round(memBytes/1024)} kB`;
}
function formatmemchange(memBytes) {
  return `${memBytes>0?'+':''}${formatmem(memBytes)}`;
}
function lpad (string, len) {
  if (!len) len = 16;
  let pad = ' ';
  while (pad.length < len) {
    pad += pad;
  }
  return pad.substr(0, len-string.length) + string;
}
setInterval(function() {
  var memoryUsage = process.memoryUsage();
  console.log(`[MEMORYUSAGE] ${lpad("rss   ")}${lpad("heapTotal   ")}${lpad("heapUsed   ")}`);
  console.log(` Current      ${lpad(formatmem(memoryUsage.rss))}${lpad(formatmem(memoryUsage.heapTotal))}${lpad(formatmem(memoryUsage.heapUsed))}`);
  console.log(` Change       ${lpad(formatmemchange(memoryUsage.rss - memoryUsageLast.rss))}${lpad(formatmemchange(memoryUsage.heapTotal - memoryUsageLast.heapTotal))}${lpad(formatmemchange(memoryUsage.heapUsed - memoryUsageLast.heapUsed))}`);
  console.log(` Accumulation ${lpad(formatmemchange(memoryUsage.rss - memoryUsageInitial.rss))}${lpad(formatmemchange(memoryUsage.heapTotal - memoryUsageInitial.heapTotal))}${lpad(formatmemchange(memoryUsage.heapUsed - memoryUsageInitial.heapUsed))}`);
  if (memoryUsageLast) {
  }
  memoryUsageLast = memoryUsage;
}, 10000);
setInterval(function() {
  // Env. variance
  if (Ruuvitag) {
    Ruuvitag.values.env.temp++;
  }
}, 5000);
