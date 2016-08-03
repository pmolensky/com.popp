"use strict";

const path          = require('path');
const ZwaveDriver   = require('homey-zwavedriver');


module.exports = new ZwaveDriver( path.basename(__dirname), {
    debug: true,
    capabilities: {
      'onoff': {
      'command_class'			: 'COMMAND_CLASS_SWITCH_BINARY',
      'command_get'				: 'SWITCH_BINARY_GET',
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
      'measure_temperature': {
      'command_class'				: 'COMMAND_CLASS_SENSOR_MULTILEVEL',
      'command_get'				: 'SENSOR_MULTILEVEL_GET',
      'command_get_parser'		: function(){
          return {
          'Sensor Type': 'Temperature (version 1)',
          'Properties1': {
          'Scale': 0
        }
      }
    },
  'command_report'			: 'SENSOR_MULTILEVEL_REPORT',
  'command_report_parser'		: function( report ){
    if( report['Sensor Type'] !== 'Temperature (version 1)' )
      return null;

    return report['Sensor Value (Parsed)'];
  }
},


    settings: {
        "report_type": {
            "index": 1,
            "size": 1,
            "parser": function(input) {
                return new Buffer([ parseInt(input) ]);
            }
        },
        "led_indication": {
            "index": 2,
            "size": 1,
            "parser": function(input) {
                return new Buffer([input ? 1 : 0 ]);
            }
        }
    }
})
