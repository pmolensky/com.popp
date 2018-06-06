'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P004407 extends ZwaveDevice {
	async onMeshInit() {
		this.enableDebug();
		this.printNode();
		this.registerCapability('alarm_co2', 'NOTIFICATION');
		this.registerCapability('alarm_tamper', 'NOTIFICATION');
		this.registerCapability('measure_battery', 'BATTERY');
		this.registerCapability('alarm_battery', 'BATTERY');
	}
}
module.exports = P004407;
