import RPi.GPIO as GPIO
import time

Buzzer = 11

def setup():
	GPIO.setmode(GPIO.BOARD)
	GPIO.setup(Buzzer, GPIO.OUT)
	global Buzz
	Buzz = GPIO.PWM(Buzzer, 440)
	Buzz.start(50)

def destory():
	Buzz.stop()
	GPIO.output(Buzzer, 1)
	GPIO.cleanup()

if __name__=='__main__':
	setup()
	timeout = time.time() + 120
	while time.time() <= timeout:
		time.sleep(1)
		Buzz.ChangeDutyCycle(0)
		time.sleep(0.5)
		Buzz.ChangeDutyCycle(50)

	destory()
