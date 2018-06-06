'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P005206 extends ZwaveDevice {
  async onMeshInit() {
      this.registerCapability('measure_wind_strenght', 'METER_WIND', {
				get: 'METER_GET',
				report: 'METER_REPORT',
				reportParser: report => {
					if (report.hasOwnProperty('Properties1')
						&& report.Properties1.hasOwnProperty('Meter Type')
						&& report.Properties1['Meter Type'] === "1"
						&& report.hasOwnProperty('Properties2')
						&& report.Properties2.hasOwnProperty('Scale bits 10')
						&& report.Properties2['Scale bits 10'] === 0) {
							return report['Meter Value (Parsed)'];
						}
					return null;
				}
			});
      this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
      this.registerCapability('measure_luminance', 'SENSOR_MULTILEVEL');
      this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL');
      this.registerCapability('measure_pressure', 'SENSOR_MULTILEVEL', {
              get: 'SENSOR_MULTILEVEL_GET',
              getParser: () => ({
                'Sensor Type': 'Barometric pressure (version 2)',
                Properties1: {
                  Scale: 0,
                },
              }),
              report: 'SENSOR_MULTILEVEL_REPORT',
              reportParser: report => {
                if (report && report.hasOwnProperty('Sensor Type') && report.hasOwnProperty('Sensor Value (Parsed)')) {
                  if (report['Sensor Type'] === 'Barometric pressure (version 2)') return report['Sensor Value (Parsed)'];
                }
                return null;
              }
            });
      this.registerCapability('measure_dewpoint', 'SENSOR_MULTILEVEL', {
                get: 'SENSOR_MULTILEVEL_GET',
                getParser: () => ({
                  'Sensor Type': 'Dew point (version 2)',
                  Properties1: {
                    Scale: 0,
                  },
                }),
                report: 'SENSOR_MULTILEVEL_REPORT',
                reportParser: report => {
                  if (report && report.hasOwnProperty('Sensor Type') && report.hasOwnProperty('Sensor Value (Parsed)')) {
                    if (report['Sensor Type'] === 'Dew point (version 2)') return report['Sensor Value (Parsed)'];
                  }
                  return null;
                }
              });
      this.registerCapability('alarm_tamper', 'SENSOR_BINARY');
      this.registerCapability('measure_battery', 'BATTERY');
  }
}
module.exports = P005206;
