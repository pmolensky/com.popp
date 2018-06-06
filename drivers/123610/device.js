'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P123610 extends ZwaveDevice {
onMeshInit() {
		this.registerCapability('onoff', 'SWITCH_BINARY');
	}
}
module.exports = P123610;
