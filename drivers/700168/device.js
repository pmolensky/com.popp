'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P700168 extends ZwaveDevice {
  onMeshInit() {
    this.registerCapability('alarm_rain', 'BASIC');
    this.registerCapability('meter_rain', 'METER');
    this.registerCapability('measure_rain', 'SENSOR_MULTILEVEL', {
        get: 'SENSOR_MULTILEVEL_GET',
        getParser: () => ({
          'Sensor Type': 'Rain rate (version 2)',
          Properties1: {
            Scale: 0,
            'Rate Type:': 'Import'
          },
        }),
        report: 'SENSOR_MULTILEVEL_REPORT',
        reportParser: report => {
          if (report && report.hasOwnProperty('Sensor Type') && report.hasOwnProperty('Sensor Value (Parsed)')) {
            if (report['Sensor Type'] === 'Rain rate (version 2)') return report['Sensor Value (Parsed)'];
          }
          return null;
        },
      });
    this.registerCapability('measure_battery', 'BATTERY');
    this.registerCapability('alarm_battery', 'BATTERY');
    }
  }
  module.exports = P700168;
