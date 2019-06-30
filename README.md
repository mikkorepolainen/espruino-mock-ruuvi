# Espruino Mock Ruuvi

Node.js command line mock workbench to aid in developing code for the espruino-ruuvitag firmware.

## Description

A mock workbench for running espruino-js code written for the ruuvitag sensor.

The purpose of the tool is to be able to quickly validate and sanity-check the espruino javascript code as it is,
receive console notifications about what the platform would be doing
and to monitor the memory behaviour of the application.

At the moment, only a handful of basic features are available. Feel free to add and submit changes or additional features.

## Usage

Install node if not already installed.

Clone this repo, then run `npm install`

Run `npm start <relative-path-to-espruino-js-file>` 

To install globally, run `npm install -g`.
After that, usage is: `espruino-mock-ruuvi <relative-path-to-espruino-js-file>` 

## Notes

- The firmware version used during development was [2v03](https://www.espruino.com/Download#ruuvitag) of the Espruino Ruuvitag-specific firmware.
- The ble_eddystone and ble_ibeacon modules are included in the repo as local modules, downloaded directly from http://www.espruino.com/modules/ (updated on 2019-06-30).
- Ruuvitag module is also included as a local module but it is not the actual module from espruino but rather a mock implementation.
- The implementation may be different on other firmware versions.

## More

- <https://lab.ruuvi.com/dfu/>
- <https://www.espruino.com/Ruuvitag>
