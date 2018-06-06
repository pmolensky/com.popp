'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P005107 extends ZwaveDevice {
  onMeshInit() {
	this.enableDebug();
    this.printNode();
    this.registerCapability('onoff', 'SWITCH_BINARY', {
      get: 'SWITCH_BINARY_GET',
      set: 'SWITCH_BINARY_SET',
      setParserV1: value => ({
        'Switch Value': (value) ? 'on/enable' : 'off/disable',
      }),
      report: 'SWITCH_BINARY_REPORT',
      reportParser: report => {
        if (report && report.hasOwnProperty('Value')) {
          if (report.Value === 'on/enable') {
			this.log('LogSirenOn');
            this.emit('SirenTriggerOn');
            return true;
          } else if (report.Value === 'off/disable') {
			this.log('LogSirenOff');
            this.emit('SirenTriggerOff');
            return false;
          }
        }
        return null;
      },
    });
    this.registerCapability('alarm_siren', 'NOTIFICATION', {
      get: 'NOTIFICATION_GET',
      getParser: () => ({
        'V1 Alarm Type': 0,
        'Notification Type': 'Siren',
      }),
      report: 'NOTIFICATION_REPORT',
      reportParser: report => {
        if (report && report['Notification Type'] === 'Siren') {
          if (report['Event'] === 1) {
            this.emit('SirenTrigger');
            return true;
          }
          if (report['Event'] === 0) return false;
        }
        return null;
      }
    });
    this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
    this.registerCapability('alarm_tamper', 'SENSOR_BINARY');
    this.registerCapability('measure_battery', 'BATTERY');
    this.registerCapability('alarm_battery', 'BATTERY');




    //===== CONTROL Binary Switch
    // define FlowCardAction to set the Switch
    let P005107_alarm_state_run_listener = async (args) => {
      this.log('FlowCardAction Set LED level for: ', args.alarm_state);
      let result = await args.device.node.CommandClass.COMMAND_CLASS_SWITCH_BINARY.SWITCH_BINARY_SET({
        'Switch Value': args.alarm_state
      });
      this.log("outcome: ", result)
      if (result !== 'TRANSMIT_COMPLETE_OK') throw new Error(result);
    };

    let actionP005107_alarm_state = new Homey.FlowCardAction('alarm_state');
    actionP005107_alarm_state
      .register()
      .registerRunListener(P005107_alarm_state_run_listener);

    // Cards that responde to the siren activating / blink icon alarm
    // Register Flow card trigger
    const SirenFlowTrigger = new Homey.FlowCardTriggerDevice('alarm_siren');
    SirenFlowTrigger.register();

    // Check if Flow card is registered in app manifest
    if (!(SirenFlowTrigger instanceof Error)) {

      // Handle Emergency notification
      this.on('SirenTrigger', async () => {
        //this.log('SirenTrigger');
        try {
          await SirenFlowTrigger.trigger(this, {}, {});
        } catch (err) {
          this.error('failed_to_trigger_alarm_siren_flow', err);
        }
      });
    } else this.error('missing_alarm_siren_card_in_manifest');



  }
}

module.exports = P005107;
