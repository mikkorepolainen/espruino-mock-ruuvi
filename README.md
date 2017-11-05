# Espruino Mock Ruuvi

Node.js command line mock workbench for dev-testing code running on the espruino-ruuvitag firmware.

## Description

A mock workbench for testing espruino-js code written for the ruuvitag sensor.

The purpose of the tool is to be able to quickly validate and sanity-check the espruino javascript code as it is,
receive console notifications about what the platform would be doing
and to monitor the memory behaviour of the application.

At the moment, only a handful of basic features are available. Feel free to add and submit changes or additional features.

The tool is not suitable for production testing because the actual espruino-ruuvitag firmware is different from the node.js platform.

## Usage

Install node if not already installed.

Clone this repo, then run `npm install -g` within it.

Run `espruino-mock-ruuvi <relative-path-to-espruino-js-file>` 

## Notes

- The firmware version used during development was [1v94](https://www.espruino.com/files/espruino_1v94.zip) of the Espruino Ruuvitag-specific firmware.
- Some of the modules used are included in the repo as local modules, downloaded directly from http://www.espruino.com/modules/ at the time of writing.
  The licenses for these modules are unclear and the implementation may be different on other firmware versions.

## More

- <https://lab.ruuvi.com/dfu/>
- <https://www.espruino.com/Ruuvitag>
