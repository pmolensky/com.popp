'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P009501 extends ZwaveDevice {
	async onMeshInit() {
		this.registerCapability('onoff', 'SWITCH_BINARY');
	}
}
module.exports = P009501;
