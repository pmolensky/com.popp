"use strict";

const path          = require('path');
const ZwaveDriver   = require('homey-zwavedriver');

module.exports = new ZwaveDriver( path.basename(__dirname), {
    debug: true,
    capabilities: {
			'onoff': {
				'command_class': 'COMMAND_CLASS_SWITCH_BINARY',
	            'command_get': 'SWITCH_BINARY_GET',
	            'command_set': 'SWITCH_BINARY_SET',
				'command_set_parser': value => {
		              return {
			                 'Switch Value': (value > 0) ? 'on/enable' : 'off/disable'
		                   };
				},
	            'command_report': 'SWITCH_BINARY_REPORT',
            	'command_report_parser': report => report['Value'] === 'on/enable'
			},
			'alarm_tamper': {
				'command_class': 'COMMAND_CLASS_SENSOR_BINARY',
				'command_get': 'SENSOR_BINARY_GET',
				'command_get_parser': () => {
					return {
						'Sensor Type': 'Tamper'
					};
				},
				'command_report': 'SENSOR_BINARY_REPORT',
				'command_report_parser': report => {
					if (report['Sensor Type'] === 'Tamper')
						report['Sensor Value'] === 'detected an event'
				}
			},
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
            "siren_trigger_mode": {
				"index": 1,
				"size": 1,
            },
			"siren_temp_correction": {
				"index": 2,
				"size": 1,
            },
			"siren_report_unsolicited": {
				"index": 3,
				"size": 1,
            },
			"siren_unsolicited_time": {
				"index": 4,
				"size": 2,
            },
            "siren_alarm_mode": {
                "index": 5,
                "size": 1,
            },
			"siren_auto_off": {
                "index": 6,
                "size": 1,
            }
        }
	}
);

Homey.manager('flow').on('action.sound_alarm', function( callback, args ){
	Homey.log('');
	Homey.log('on flow action.action.sound_alarm');
	Homey.log('args', args);

	Homey.manager('drivers').getDriver('005107').capabilities.onoff.set(args.device, true, function (err, data) {
		Homey.log('');
		Homey.log('Homey.manager(drivers).getDriver(005107).capabilities.onoff.set');
		Homey.log('err', err);
		Homey.log('data', data);
		if (err) callback (err, false);
	});

	callback( null, true );
});

Homey.manager('flow').on('action.silence_alarm', function( callback, args ){
	Homey.log('');
	Homey.log('on flow action.action.silence_alarm');
	Homey.log('args', args);

	Homey.manager('drivers').getDriver('005107').capabilities.onoff.set(args.device, false, function (err, data) {
		Homey.log('');
		Homey.log('Homey.manager(drivers).getDriver(005107).capabilities.onoff.set');
		Homey.log('err', err);
		Homey.log('data', data);
		if (err) callback (err, false);
	});

	callback( null, true );
});
