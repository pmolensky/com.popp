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
    }
)
