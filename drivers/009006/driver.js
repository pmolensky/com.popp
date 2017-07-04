"use strict";

const path			= require('path');
const ZwaveDriver	= require('homey-zwavedriver');


module.exports = new ZwaveDriver(path.basename(__dirname), {
		debug : false,
		capabilities : {
			'onoff' : {
				'command_class' : 'COMMAND_CLASS_SWITCH_MULTILEVEL',
				'command_get' : 'SWITCH_MULTILEVEL_GET',
				'command_set' : 'SWITCH_MULTILEVEL_SET',
				'command_set_parser' : function (value) {
					return {
						'Value' : value ? 'on/enable' : 'off/disable',
						'Dimming Duration' : 1
					}
				},
				'command_report' : 'SWITCH_MULTILEVEL_REPORT',
				'command_report_parser' : function (report) {
					return report['Value (Raw)'][0] > 0;
				}
			}			
		},
		settings : {
		"switch_first_channel_off_after": {
			"index": 2,
			"size": 2,
			"parser": function( input ) {
				return new Buffer([ parseInt(input) ]);
			}
		},
		"energy_consumption_first_channel": {
			"index": 20,
			"size": 2,
			"parser": function( input ) {
				return new Buffer([ parseInt(input) ]);
			}
		},
		"switch_second_channel_off_after": {
			"index": 22,
			"size": 2,
			"parser": function( input ) {
				return new Buffer([ parseInt(input) ]);
			}
		},
		"energy_consumption_second_channel": {
			"index": 40,
			"size": 2,
			"parser": function( input ) {
				return new Buffer([ parseInt(input) ]);
			}
		}
	}
	})
