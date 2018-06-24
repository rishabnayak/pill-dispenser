import smbus, time

## Running this program will move the servo to neutral, pause for two seconds,
##  move it to one extreme, pause for two seconds, then move to the other
##  extreme and exit the program.

bus = smbus.SMBus(1)  # the chip is on bus 1 of the available I2C buses
addr = 0x40           # I2C address of the PWM chip.
bus.write_byte_data(addr, 0, 0x20)     # enable the chip
bus.write_byte_data(addr, 0xfe, 0x1e)  # configure the chip for multi-byte write

bus.write_word_data(addr, 0x06, 0)
bus.write_word_data(addr, 0x08, 1664)
time.sleep(0.7)
bus.write_word_data(addr, 0x08, 0)
