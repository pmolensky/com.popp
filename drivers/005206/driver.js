"use strict";

const path          = require('path');
const ZwaveDriver   = require('homey-zwavedriver');

module.exports = new ZwaveDriver( path.basename(__dirname), {
    debug: true,
    capabilities: {
	        'measure_temperature': {
				'command_class': 'COMMAND_CLASS_SENSOR_MULTILEVEL',
				'command_get': 'SENSOR_MULTILEVEL_GET',
				'command_get_parser': () => {
					return {
				'Sensor Type': 'Temperature (version 1)',
				'Properties1': {
					'Scale': 0
						}
					};
				},
				'command_report': 'SENSOR_MULTILEVEL_REPORT',
				'command_report_parser': report => {
				if (report['Sensor Type'] === "Temperature (version 1)" &&
					report.hasOwnProperty("Level") &&
					report.Level.hasOwnProperty("Scale") &&
					report.Level.Scale === 0)					
					return report['Sensor Value (Parsed)'];
					return null;
				}
			},
			'alarm_battery': { 
    			'command_class': 'COMMAND_CLASS_BATTERY',
	    		'command_get': 'BATTERY_GET',
    			'command_report': 'BATTERY_REPORT',
    			'command_report_parser': (report, node) => { 
    				if(report.hasOwnProperty('Battery Level (Raw)')) {
    					if (report['Battery Level (Raw)'][0] == 255) {
    						return true
    						}
    					return false
   	        			}
   					}		
			},
			'measure_battery': { 
    			getOnWakeUp: true,
    			'command_class': 'COMMAND_CLASS_BATTERY',
	    		'command_get': 'BATTERY_GET',
    			'command_report': 'BATTERY_REPORT',
    			'command_report_parser': (report, node) => { 
    				if(report.hasOwnProperty('Battery Level (Raw)')) {
    					if(report['Battery Level (Raw)'][0] == 255) return 1;
        				return report['Battery Level (Raw)'][0];
						}
					return null;
    			}
			}
		},
  settings: {
            "1": {
				"index": 1,
				"size": 1,
            },
			"2": {
				"index": 2,
				"size": 1,
            }
        }
});
