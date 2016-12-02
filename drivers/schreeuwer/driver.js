"use strict";

const path          = require('path');
const ZwaveDriver   = require('homey-zwavedriver');

// http://www.popp.eu/wp-content/uploads/2015/11/Manual_Solar-Siren_POPP_En.pdf

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
    			'command_class'			: 'COMMAND_CLASS_SENSOR_BINARY',
    			'command_get'				: 'SENSOR_BINARY_GET',
    			'command_get_parser'		: function(){
    				return {
    					'Sensor Type': 'General Purpose Alarm'
    				}
    			},
    			'command_report'			: 'SENSOR_BINARY_REPORT',
    			'command_report_parser'		: function( report ){
    				Homey.log('[EVR DEBUG] alarm_tamper report:', report);
    				return report['Sensor State'] === 'alarm';
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


    'measure_battery': {
	       'command_class': 'COMMAND_CLASS_BATTERY',
	       'command_get': 'BATTERY_GET',
	       'command_report': 'BATTERY_REPORT',
	           'command_report_parser': report => {
		             if (report['Battery Level'] === "battery low warning")
			              return 1;
				        return report['Battery Level (Raw)'][0];
	             }
    }
	},

  settings: {
                "siren_trigger_mode": {
                "index": 1,
                "size": 1,
                "parser": function( input ) {
                return new Buffer([ parseInt(input) ]);
                  }
                },
                "siren_alarm_mode": {
                "index": 5,
                "size": 1,
                "parser": function( input ) {
                return new Buffer([ parseInt(input) ]);
                  }
                }
              }
        }
);


Homey.manager('flow').on('action.sound_alarm', function( callback, args ){
	Homey.log('');
	Homey.log('on flow action.action.sound_alarm');
	Homey.log('args', args);

	Homey.manager('drivers').getDriver('schreeuwer').capabilities.onoff.set(args.device, true, function (err, data) {
		Homey.log('');
		Homey.log('Homey.manager(drivers).getDriver(schreeuwer).capabilities.onoff.set');
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

	Homey.manager('drivers').getDriver('schreeuwer').capabilities.onoff.set(args.device, false, function (err, data) {
		Homey.log('');
		Homey.log('Homey.manager(drivers).getDriver(schreeuwer).capabilities.onoff.set');
		Homey.log('err', err);
		Homey.log('data', data);
		if (err) callback (err, false);
	});

	callback( null, true );
});
