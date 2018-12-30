'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P700045 extends ZwaveDevice {
  onMeshInit() {
    this.registerCapability('alarm_contact', 'SENSOR_BINARY');
    this.registerCapability('alarm_tamper', 'NOTIFICATION');
    this.registerCapability('measure_battery', 'BATTERY');
    this.registerCapability('alarm_battery', 'BATTERY');

    // define and register FlowCardTriggers
    let triggerUser = new Homey.FlowCardTriggerDevice('user_validated');
    triggerUser
      .register()
      .registerRunListener((args, state) => {
        //this.log(args, state);
        return Promise.resolve(args.button === state.button || (args.button == 0 && state.button >= 1 && state.button <= 20) /* && args.scene === state.scene */ );
      })

    let triggerRing = new Homey.FlowCardTriggerDevice('ring_button');
    triggerRing
      .register()
      .registerRunListener((args, state) => {
        return Promise.resolve(args.button === state.button );
      })

    let triggerInvalid = new Homey.FlowCardTriggerDevice('code_invalid');
    triggerInvalid
      .register()
      .registerRunListener((args, state) => {
        return Promise.resolve(state.button === '23' );
      })

    // register a report listener (SDK2 style not yet operational)
    this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', (rawReport, parsedReport) => {
      if (rawReport.hasOwnProperty('Properties1') &&
        rawReport.Properties1.hasOwnProperty('Key Attributes') &&
        rawReport.hasOwnProperty('Scene Number') &&
        rawReport.hasOwnProperty('Sequence Number')) {
        if (typeof PreviousSequenceNo === "undefined") { var PreviousSequenceNo = 0; }
        if (rawReport['Sequence Number'] !== PreviousSequenceNo) {
          const remoteValue = {
            button: rawReport['Scene Number'].toString(),
            scene: rawReport.Properties1['Key Attributes'],
          };
          PreviousSequenceNo = rawReport['Sequence Number'];
          this.log('Triggering sequence:', PreviousSequenceNo, 'remoteValue', remoteValue);
          // Trigger the trigger card with 2 dropdown options
          if(remoteValue.button == 21 || remoteValue.button == 22) { // bell-button: 21=once; 22=twice
            triggerRing
              .trigger(this, triggerRing.getArgumentValues, remoteValue)
              .catch( err => { this.log('ReportListener', err) } );
          } else if(remoteValue.button == 23) { // unrecognized user code
            triggerInvalid
              .trigger(this, triggerInvalid.getArgumentValues, remoteValue)
              .catch( err => { this.log('ReportListener', err) } );
          } else { //assuming user code 1-20
            triggerUser
              .trigger(this, triggerUser.getArgumentValues, remoteValue)
              .catch( err => { this.log('ReportListener', err) } );
          }
        }
      }
    });
  }
}
module.exports = P700045;
