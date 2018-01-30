
enum MotorTpye {
    //% block=servo
    Servo = 0x24,
    //% block=wheel
    Wheel = 0x28
};

enum SpeedTpye {
    //% block=slow
    Slow = 1,
    //% block=medium
    Medium = 2,
    //% block=fast
    Fast = 3
};

enum DirectionTpye {
    //% block=forward
    Forward = 1,
    //% block=backward
    Backward = 2,
    //% block=left
    Left = 3,
    //% block=right
    Right = 4,
    //% block=clockwise
    Clockwise = 5,
    //% block="antic-lockwise"
    Anticlockwise = 6
};

enum MotionTpye {
    //% block="random direction"
    Random = 0,
    //% block=automatically
    Auto = 1
};

/**
 * Functions to operate G0 module.
 */
//% weight=48 color=#A26236 icon="\uf018" block="Motor"
namespace motor
{
    /**
     * Set the servo position by degree.
     * @param degree set the degree you want to move.
     */
    //% blockId=motor_move_servo block="servo move to|%degree|(degree)"
    //% degree.min=0 degree.max=180 degree.defl=0
    //% weight=100 blockGap=8
    export function moveServoTo(degree: number)
    {
        let data: Buffer = pins.createBuffer(2);
        data[0] = 0x02;
        data[1] = degree;
        driver.i2cSendBytes(0x24, data);
    }
    
    /**
     * Set the actions and the moving speed of motormodule.
     * @param direction the direction that want to set.
     * @param speed the speed that want to run.
     */
    //% blockId=motor_set_action block="go|%direction|at speed|%speed"
    //% weight=99 blockGap=8
    export function setMotormoduleAction(direction: DirectionTpye, speed: SpeedTpye)
    {
        let data: Buffer = pins.createBuffer(5);
        data[0] = 0x02;
        data[1] = speed;
        data[2] = direction;
        data[3] = 0;
        data[4] = 0;
        driver.i2cSendBytes(MotorTpye.Wheel, data);
    }
    
    /**
     * Stop the motormodule.
     */
    //% blockId=motor_stop_run block="stop"
    //% weight=98 blockGap=8
    export function stopMotormodule()
    {        
        setMotormoduleSpeed(0, 0);
    }
    
    /**
     * Set the speed of motors on motormodule.
     * @param left the left speed you want to run.
     * @param right the right speed you want to run.
     */
    //% blockId=motor_set_speed_with_duty block="set motor speed left|%left|right|%right"
    //% left.min=-255 left.max=255 left.defl=0
    //% right.min=-255 right.max=255 right.defl=0
    //% weight=100 blockGap=8
    //% advanced=true
    export function setMotormoduleSpeed(left: number, right: number)
    {
        let data: Buffer = pins.createBuffer(5);
        data[0] = 0x01;
        data[1] = left & 0xff;
        data[2] = (left >> 8) & 0xff;
        data[3] = right & 0xff;
        data[4] = (right >> 8) & 0xff;
        driver.i2cSendBytes(MotorTpye.Wheel, data);
    }
    
    /**
     * Set the actions and the moving speed of motormodule when it lost the line(detected by the line follower).
     * @param motion the motion that want to set.
     * @param speed the speed that want to run.
     */
    //% blockId=motor_when_lost_line block="go|%motion|at speed|%speed|when lost the line"
    //% weight=99 blockGap=8
    //% advanced=true
    export function whenMotormoduleLostLine(motion: MotionTpye, speed: SpeedTpye)
    {
        if((motion == MotionTpye.Auto))
        {
            if((sensor.linerEventValue == LinerEvent.Left) || (sensor.linerEventValue == LinerEvent.Leftmost))
                motion = 6; // Anticlockwise
            else if((sensor.linerEventValue == LinerEvent.Right) || (sensor.linerEventValue == LinerEvent.Rightmost))
                motion = 5; // Clockwise
        }
        else if((motion == MotionTpye.Random))
        {
            let random: number = Math.random(1);
            if(random == 0)motion = 5; // Clockwise
            else if(random == 1)motion = 6; // Anticlockwise
        }

        let data: Buffer = pins.createBuffer(5);
        data[0] = 0x02;
        data[1] = speed;
        data[2] = motion;
        data[3] = 0;
        data[4] = 0;
        driver.i2cSendBytes(MotorTpye.Wheel, data);
    }
}