
enum SensorType {
    //% block=sound
	Sound = 6,
    //% block=gesture
    Gesture = 0x0c,
    //% block=encoder
    Encoder = 0x10,   
    //% block=liner
    Liner = 0x27
    
};

enum GestureEvent
{
    //% block=left
    Left = 2,
    //% block=right
	Right = 1,
    //% block=up
    Up = 3,
    //% block=down
    Down = 4,
    //% block=forward
    Forward = 5,
    //% block=backward
    Backward = 6,
    //% block=clockwise
    Clockwise = 7,
    //% block=anticlockwise
    Anticlockwise = 8,
    //% block=wave
    Wave = 9
};

enum KnobEvent
{
    //% block="rotate clockwise"
	Clockwise = 1,
    //% block="rotate anti-clockwise"
	Anticlockwise = 2,
    //% block=press
	Press = 3
};

enum ColorEvent
{
    //% block=black
	Black = 1,
    //% block=r
    R = 2,
    //% block=g
    G = 3,
    //% block=b
    B = 4,
    //% block=other
    Other = 5
};

enum LinerEvent
{
    //% block=middle
	Middle = 1,
    //% block=left
	Left = 3,
    //% block=leftmost
	Leftmost = 4,
    //% block=right
    Right = 5,
    //% block=rightmost
    Rightmost = 6,
    //% block=lost
    Lost = 2
};

/**
 * Functions to operate G0 module.
 */
//% weight=50 color=#E5B646 icon="\uf0c3" block="Sensor"
namespace sensor
{
    /**
     * Do something when the sound sensor detects a loud sound.
     * @param handler code to run
     */
    //% blockId=sensor_sound_create_event block="on loud sound"
    //% weight=100 blockGap=8
    export function onLoudSound(handler: Action) {
        const eventId = driver.subscribeToEventSource(SensorType.Sound);
        control.onEvent(eventId, 3, handler);
    }
    
    /**
     * Set the sound threshold for triggering an event.
     * @param value the value of threshold level
     */
    //% blockId=sensor_set_sound_threshold block="set sound threshold to|%value"
    //% value.min=0 value.max=1023 value.defl=200
    //% weight=99 blockGap=8
    export function setSoundThresold(value: number)
    {
        let data: Buffer = pins.createBuffer(5);
        data[0] = 0x03;
        data[1] = 1; // 0: Low threshold; 1: High threshold
        data[2] = value & 0xff;
        data[3] = value >> 8;
        data[4] = 0; // 0: Save to ram; 1: Save to flash.
        driver.i2cSendBytes(6, data);
    }
    
    /**
     * Get the noise level from the sound sensor.
     */
    //% blockId=grove_get_sound_value block="sound level"
    //% weight=98 blockGap=8
    export function getSoundLevel(): number
    {
        let data: Buffer = pins.createBuffer(2);
        driver.i2cSendByte(0x06, 2);
        data = driver.i2cReceiveBytes(0x06, 2);
        return (data[0] + data[1] * 256);
    }
    
    /**
     * Do something when the gesture sensor detects a motion. (hand swip left, swip righ etc.)
     * @param event type of gesture to detect
     * @param handler code to run
     */
    //% blockId=sensor_gesture_create_event block="on gesture|%event"
    //% weight=97 blockGap=8
    export function onGesture(event: GestureEvent, handler: Action) {
        const eventId = driver.subscribeToEventSource(SensorType.Gesture);
        control.onEvent(eventId, event, handler);
    }
    
    /**
     * Do something when the knob is rotated or pressed.
     * @param event type of encoder to detect
     * @param handler code to run
     */
    //% blockId=sensor_encoder_create_event block="on knob|%event"
    //% weight=96 blockGap=8
    export function onKnob(event: KnobEvent, handler: Action) {
        const eventId = driver.subscribeToEventSource(SensorType.Encoder);
        control.onEvent(eventId, event, handler);
    }
    
    /**
     * Do something when the color sensor detects a specific color.
     * @param event type of color to detect
     * @param handler code to run
     */
    //% blockId=sensor_color_create_event block="on color|%event"
    //% weight=94 blockGap=8
    export function onColor(event: ColorEvent, handler: Action) {
        const eventId = driver.subscribeToEventSource(SensorType.Liner);
        control.onEvent(eventId, event, handler);
    }
    
    export let linerEventValue = 0;
    const eventIdLiner = 9000;
    let initLiner = false;
    let lastLiner = 0;
    
    /**
     * Do something when the line follower recognized the position of the line underneath.
     * @param event type of liner to detect
     * @param handler code to run
     */
    //% blockId=sensor_liner_create_event block="on line position|%event"
    //% weight=95 blockGap=8
    export function onLinePosition(event: LinerEvent, handler: Action) {
        control.onEvent(eventIdLiner, event, handler);
        if (!initLiner) {
            initLiner = true;
            control.inBackground(() => {
                while(true) {
                    driver.i2cSendByte(SensorType.Liner, 0x02);
                    const event = driver.i2cReceiveByte(SensorType.Liner);
                    if(event > 2)linerEventValue = event;                    
                    if (event != lastLiner) {
                        lastLiner = event;
                        control.raiseEvent(eventIdLiner, lastLiner);
                    }
                    basic.pause(50);
                }
            })
        }
    }
    
    /**
     * Get the color value from the color sensor in R:G:B.
     */
    //% blockId=sensor_get_color_rgb block="color"
    //% weight=94 blockGap=8
    export function getColor(): number
    {
        let data: Buffer = pins.createBuffer(4);
        driver.i2cSendByte(SensorType.Liner, 0x04);
        data = driver.i2cReceiveBytes(SensorType.Liner, 4);
        return (data[0] + data[1] * 256 + data[2] * 65536);
    }
    
    /**
     * See if the sound sensor detected a loud sound.
     */
    //% blockId=sensor_is_sound_event_generate block="loud sound was triggered"
    //% weight=100 blockGap=8
    //% advanced=true
    export function wasLoudSoundTriggered(): boolean
    {
        if(driver.addrBuffer[SensorType.Sound] == 0)onLoudSound(() => {});
        if(driver.lastStatus[SensorType.Sound] == 3) return true;
        return false;
    }
    
    /**
     * See if the gesture sensor detected a specific gesture.
     * @param event of gesture device
     */
    //% blockId=sensor_is_gesture_event_generate block="gesture|%event|was triggered"
    //% weight=99 blockGap=8
    //% advanced=true
    export function wasGestureTriggered(event: GestureEvent): boolean
    {
        let eventValue = event;
        if(driver.addrBuffer[SensorType.Gesture] == 0)onGesture(event, () => {});
        if(driver.lastStatus[SensorType.Gesture] == eventValue)return true;
        return false;
    }
    
    /**
     * See if the knob was rotated or pressed.
     * @param event of encoder device
     */
    //% blockId=sensor_is_encoder_event_generate block="knob|%event|was triggered"
    //% weight=98 blockGap=8
    //% advanced=true
    export function wasKnobTriggered(event: KnobEvent): boolean
    {
        let eventValue = event;
        if(driver.addrBuffer[SensorType.Encoder] == 0)onKnob(event, () => {});
        if(driver.lastStatus[SensorType.Encoder] == eventValue)return true;
        return false;
    }

    /**
     * See if the color sensor detected a specific color.
     * @param event of color device
     */
    //% blockId=sensor_is_color_event_generate block="color|%event|was triggered"
    //% weight=97 blockGap=8
    //% advanced=true
    export function wasColorTriggered(event: ColorEvent): boolean
    {
        let eventValue = event;
        if(driver.addrBuffer[SensorType.Liner] == 0)onColor(event, () => {});
        if(driver.lastStatus[SensorType.Liner] == eventValue)return true;
        return false;
    }    
    
    /**
     * See if the line follower recognized the position of the line underneath.
     * @param event of liner device
     */
    //% blockId=sensor_is_liner_event_generate block="line position|%event|was triggered"
    //% weight=96 blockGap=8
    //% advanced=true
    export function wasLinePositionTriggered(event: LinerEvent): boolean
    {
        let eventValue = event;
        if(!initLiner)onLinePosition(event, () => {});
        if(lastLiner == eventValue)return true;
        return false;
    }
}