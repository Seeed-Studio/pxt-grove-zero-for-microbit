# Grove Zero

A Microsoft MakeCode package for for Seeed Studio Grove Zero module.

## Basic usage

### Sensor

* Sound

Show sad icon when the sound sensor detects a loud sound.
```blocks
sensor.onLoudSound(() => {
    basic.showIcon(IconNames.Sad);
})
```
Get sound value and display on led matrix.
```blocks
let sound = 0;
basic.forever(() => {
    sound = sensor.getSoundLevel();
    basic.showNumber(sound);
})
```

Use ``||setSoundThresold||`` to set the sound threshold.

Use ``||wasLoudSoundTriggered||`` to see if the sound sensor detected a loud sound.

* Gesture

Show text on when the gesture sensor detects a motion.
```blocks
sensor.onGesture(GestureEvent.Up, () => {
    basic.showString("up")
})
sensor.onGesture(GestureEvent.Down, () => {
    basic.showString("down")
})
```

Use ``||wasGestureTriggered||`` to see if the gesture sensor detected a specific gesture.

* Encoder

Show text on when the knob is rotated or pressed.
```blocks
sensor.onKnob(KnobEvent.Clockwise, () => {
    basic.showString("+");
})
sensor.onKnob(KnobEvent.Anticlockwise, () => {
    basic.showString("-");
})
sensor.onKnob(KnobEvent.Press, () => {
    basic.showString("*");
})
```

Use ``||wasKnobTriggered||`` to see if the knob was rotated or pressed.

* Color

Show text on when the color sensor detects a specific color.
```blocks
sensor.onColor(ColorEvent.R, () => {
    basic.showString("red")
})
sensor.onColor(ColorEvent.G, () => {
    basic.showString("green")
})
sensor.onColor(ColorEvent.B, () => {
    basic.showString("blue")
})
```

Use ``||getColor||`` to get the color value from the color sensor in R:G:B.

Use ``||wasColorTriggered||`` to see if the color sensor detected a specific color.

* Liner

Show text on when the line follower recognized the position of the line underneath.
```blocks
sensor.onLinePosition(LinerEvent.Left, () => {
    basic.showString("left")
})
sensor.onLinePosition(LinerEvent.Middle, () => {
    basic.showString("middle")
})
sensor.onLinePosition(LinerEvent.Right, () => {
    basic.showString("right")
})
```

Use ``||wasLinePositionTriggered||`` to see if the line follower recognized the position of the line underneath.

### Motor

* Servo

Set the servo to 90 degree
```blocks
motor.moveServoTo(90);
```

* Wheel

Run the wheel.
```blocks
basic.forever(() => {
    motor.setMotormoduleAction(DirectionTpye.Forward, SpeedTpye.Fast);
    basic.pause(2000);
    motor.setMotormoduleAction(DirectionTpye.Backward, SpeedTpye.Fast);
    basic.pause(2000);
    motor.stopMotormodule();
    basic.pause(2000);
})
```

Use ``||setMotormoduleSpeed||`` to set the speed of motors on motor module.

Use ``||whenMotormoduleLostLine||`` to set the actions and the moving speed of motor module when it lost the line(detected by the line follower).

## License

MIT

## Supported targets

* for PXT/microbit
