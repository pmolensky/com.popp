'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P012501 extends ZwaveDevice {
	async onMeshInit() {
		this.registerCapability('locked', 'DOOR_LOCK');
		this.registerCapability('alarm_contact', 'NOTIFICATION');
		this.registerCapability('measure_battery', 'BATTERY');
		this.registerCapability('alarm_battery', 'BATTERY');
	}
}
module.exports = P012501;
