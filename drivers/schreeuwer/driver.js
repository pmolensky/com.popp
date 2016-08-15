"use strict";

const path          = require('path');
const ZwaveDriver   = require('homey-zwavedriver');


module.exports = new ZwaveDriver( path.basename(__dirname), {
    debug: true,
    capabilities: {
    		'onoff': {
    			'command_class'			: 'COMMAND_CLASS_SWITCH_BINARY',
    			'command_set'				: 'SWITCH_BINARY_SET',
    			'command_set_parser'		: function( value ){
    				return {
    					'Switch Value': value
    				}
    			},
    			'command_report'			: 'SWITCH_BINARY_REPORT',
    			'command_report_parser'		: function( report ){
    				return report['Value'] === 'on/enable';
    			}
    		},
        'measure_battery': {
		  	'command_class'				: 'COMMAND_CLASS_BATTERY',
			  'command_get'				: 'BATTERY_GET',
			  'command_report'			: 'BATTERY_REPORT',
			  'command_report_parser'		: function( report ) {
				  if( report['Battery Level'] === "battery low warning" ) return 1;
				 return report['Battery Level (Raw)'][0];
			      }
		    },

        'alarm_tamper': {
        			'command_class'				: 'COMMAND_CLASS_NOTIFICATION',
        			'command_get'				: 'NOTIFICATION_GET',
        			'command_get_parser'		: function(){
        				return {
        					'V1 Alarm Type': 0,
        					'Notification Type': 'Home Security',
        					'Event': 3
        				}
        			},
        			'command_report'			: 'NOTIFICATION_REPORT',
        			'command_report_parser'		: function( report ){

        				if( report['Notification Type'] !== 'Home Security' )
        					return null;

        				if( report['Event (Parsed)'] === 'Event inactive' ) {
        					return false;
        				} else if( report['Event (Parsed)'] === 'Tampering, Product covering removed' ) {
        					return true;
        				} else {
        					return null
        				}
        			}
        		},

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

	callback( null, true ); // we've fired successfully
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

	callback( null, true ); // we've fired successfully
});
