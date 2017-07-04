"use strict";

const path			= require('path');
const ZwaveDriver	= require('homey-zwavedriver');


module.exports = new ZwaveDriver(path.basename(__dirname), {
		debug : false,
		capabilities : {
			'onoff' : {
					'command_class': 'COMMAND_CLASS_SWITCH_BINARY',
					'command_get': 'SWITCH_BINARY_GET',
					'command_set': 'SWITCH_BINARY_SET',
					'command_set_parser': value => ({
						'Switch Value': (value) ? 'on/enable' : 'off/disable'
					}),
					'command_report': 'SWITCH_BINARY_REPORT',
					'command_report_parser': report => report.Value === 'on/enable'
				},
			measure_power: {
					command_class: 'COMMAND_CLASS_METER',
					command_get: 'METER_GET',
					command_get_parser: () => ({
						Properties1: {
							'Rate Type': 'Import',
							Scale: 2,
						},
						'Scale 2': 0,
					}),
			command_report: 'METER_REPORT',
					command_report_parser: report => {
						if (report.hasOwnProperty('Properties2') &&
							report.Properties2.hasOwnProperty('Scale bits 10') &&
							report.Properties2['Scale bits 10'] === 2) {
							return report['Meter Value (Parsed)'];
						}
						return null;
					},
				},
			meter_power: {
					command_class: 'COMMAND_CLASS_METER',
					command_get: 'METER_GET',
					command_get_parser: () => ({
						Properties1: {
							'Rate Type': 'Import',
							Scale: 0,
						},
						'Scale 2': 0,
					}),
					command_report: 'METER_REPORT',
					command_report_parser: report => {
						if (report.hasOwnProperty('Properties2') &&
							report.Properties2.hasOwnProperty('Size') &&
							report.Properties2.Size === 4 &&
							report.Properties2.hasOwnProperty('Scale bits 10') &&
							report.Properties2['Scale bits 10'] === 0) {
							return report['Meter Value (Parsed)'];
						}
						return null;
					},
				}
		},
		settings : {
		"led_indication_mode": {
			"index": 1,
			"size": 1,
		},
		"auto_switch_off": {
			"index": 2,
			"size": 2,
		},
		"state_after_powerloss": {
			"index": 5,
			"size": 1,
		},
			"led_off_color": {
			"index": 21,
			"size": 1,
		},
			"led_on_color": {
			"index": 22,
			"size": 1,
		}
	}
	})
