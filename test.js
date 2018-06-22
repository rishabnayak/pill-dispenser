const i2cbus = require('i2c-bus');
const sleep = require('sleep');
const bus = i2cbus.openSync(1);
const addr = 0x40;
bus.writeByteSync(addr, 0, 0x20);
bus.writeByteSync(addr, 0xfe, 0x1e);
bus.writeWordSync(addr, 0x06, 0);
sleep.sleep(1);
bus.writeWordSync(addr, 0x08, 836);
