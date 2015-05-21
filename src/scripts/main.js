'use strict';

var $ = require('jquery');
var Bloq = require('./bloq').Bloq;


// var oscillatorSchema = require('./bloqs/components/oscillator');
// var numberSchema = require('./bloqs/mathematics/number');
// var ledSchema = require('./bloqs/components/led');
// var servoSchema = require('./bloqs/components/servo');
// var lcdWriteSchema = require('./bloqs/components/lcdWrite');
// var declareSchema = require('./bloqs/variables/declare');
// var selectSchema = require('./bloqs/variables/select');
// var arrayVariableSchema = require('./bloqs/variables/arrayVariable');
// var basicOperationsSchema = require('./bloqs/mathematics/basicOperations');
// var ifSchema = require('./bloqs/control/if');
// var buzzerSchema = require('./bloqs/components/buzzer');
// var oscillatorStartSchema = require('./bloqs/components/oscillatorStart');
// console.log(basicOperationsSchema);
var componentsArray = {
    leds: [{
        value: '1',
        label: 'Led_1'
    }, {
        value: '2',
        label: 'Led_2'
    }],
    sensors: [{
        value: '1',
        label: 'Sensor_1',
        type: 'analog'
    }, {
        value: 'A0',
        label: 'Sensor_2',
        type: 'digital'
    }, {
        value: '2',
        label: 'Sensor_1',
        type: 'us'
    }, {
        value: '3',
        label: 'Sensor_2',
        type: 'joystick'
    }],
    buzzers: [{
        value: '18',
        label: 'buzzer_001'
    }, {
        value: '19',
        label: 'buzzer_002'
    }],
    servos: [{
        value: '1',
        label: 'servo_001'
    }, {
        value: '2',
        label: 'servo_002'
    }],
    contServos: [{
        value: '1',
        label: 'contServo_001'
    }, {
        value: '2',
        label: 'contServo_002'
    }],
    oscillators: [{
        value: '1',
        label: 'Oscillator_1'
    }, {
        value: '2',
        label: 'Oscillator_2'
    }],
    lcds: [{
        value: '1',
        label: 'lcd_001'
    }, {
        value: '2',
        label: 'lcd_002'
    }],
    variables: [{
        value: 'var1',
        label: 'var1'
    }, {
        value: 'var2',
        label: 'var2'
    }],
    serialElements: [{
        value: '1',
        label: 'serialElement_1'
    }, {
        value: '2',
        label: 'serialElement_2'
    }],
    voidFunctions: [{
        value: '1',
        label: 'voidFunctions_1'
    }, {
        value: '2',
        label: 'voidFunctions_2'
    }],
    returnFunctions: [],
    varComponents: [{
        value: '1',
        label: 'varComponents_1'
    }, {
        value: '2',
        label: 'varComponents_2'
    }],
    softwareVars: [{
        value: '1',
        label: 'varSoftware_1'
    }, {
        value: '2',
        label: 'varSoftware_2'
    }]
};

var $field = $('#field');
var createBloq = function(bloqType, posX, posY) {
    var bloq1 = new Bloq({
        bloqData: bloqType,
        componentsArray: componentsArray,
        $field: $field
    });
    $field.append(bloq1.$bloq);
    bloq1.$bloq.css({
        top: posX,
        left: posY
    });
    return bloq1;
};
//Irene's trials with getCode()
createBloq(require('./bloqs/mathematics/number'), '100px', '100px');
createBloq(require('./bloqs/functions/returnFunction'), '100px', '100px');
var bloq = createBloq(require('./bloqs/functions/invokeReturnFunction'), '300px', '200px');

$field.on('dragend', function() {
    console.log('bloq CODE -->', bloq.getCode());
    console.log('componentsArray',componentsArray.returnFunctions);
});

//Tom's trials
// // var bloq1 =
// createBloq(ledSchema, '200px','200px');
// // var bloq2 =
// createBloq(servoSchema, '250px','200px');
// // var bloq3 =
// createBloq(servoSchema, '300px','200px');
// // var bloq4 =
// createBloq(servoSchema, '350px','200px');
// // var bloq5 =
// createBloq(lcdWriteSchema,'400px','200px');
// // var bloq6 =
// createBloq(declareSchema, '450px','200px');
// // var bloq7 =
// createBloq(selectSchema, '500px','200px');
// // var bloq8 =
// createBloq(arrayVariableSchema, '550px','200px');
// // var bloq9 =
// createBloq(basicOperationsSchema, '600px','200px');
// // var bloq10 =
// createBloq(numberSchema, '600px','200px');
// // var bloq10 =
// createBloq(ifSchema, '250px','900px');