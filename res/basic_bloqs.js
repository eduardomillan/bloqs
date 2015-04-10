/**
 * Created by jesus on 30/03/15.
 */
var getProjectBloqs = function() {
    var data = {
        setup: {
            label: 'setup',
            down: true,
            color: '#000',
            code: {
                setup: "",
                loop: "void setup (){\n"
            }
        },
        loop: {
            label: 'loop',
            down: true,
            color: '#000',
            code: {
                setup: "",
                loop: "void loop (){\n"
            }
        }
    };
    return data;
};
var getBasicBloqs = function() {
    var data = {
        led: {
            up: true,
            down: true,
            color: '#e2e2e2',
            text: [
                [{
                    input: 'dropdown',
                    type: "text",
                    data: [{
                        label: 'Encender',
                        value: 'HIGH'
                    }, {
                        label: 'Apagar',
                        value: 'LOW'
                    }]
                }, "el LED", {
                    input: 'dropdown',
                    type: "text",
                    data: [{
                        label: 'LED1',
                        value: 'LED1'
                    }, {
                        label: 'LED2',
                        value: 'LED2'
                    }]
                }]
            ],
            code: {
                setup: ["digitalWrite({1},{0});\n"],
                loop: ["digitalWrite({1},{0});\n"]
            }
        },
        read: {
            output: 'number',
            color: '#e2e2e2',
            text: [
                ["Leer", {
                    input: 'dropdown',
                    type: "text",
                    data: [{
                        label: 'Sensor1',
                        value: 'Sensor1'
                    }, {
                        label: 'Sensor2',
                        value: 'Sensor2'
                    }]
                }]
            ],
            code: {
                setup: ["digitalRead({0});\n"],
                loop: ["digitalRead({0});\n"]
            }
        },
        buzzer: {
            up: true,
            down: true,
            color: '#e2e2e2',
            text: [
                ["Sonar el buzzer", {
                    input: 'dropdown',
                    type: "text",
                    data: [{
                        label: 'Buzzer1',
                        value: 'Buzzer1'
                    }, {
                        label: 'Buzzer2',
                        value: 'Buzzer2'
                    }]
                }, "con la nota", {
                    input: 'dropdown',
                    type: "text",
                    data: [{
                        label: 'Do',
                        value: '200'
                    }, {
                        label: 'Re',
                        value: '300'
                    }]
                }, "durante", {
                    input: 'userInput',
                    type: "number",
                    label: "0"
                }, "ms"]
            ],
            code: {
                setup: ["tone({0},{1},{2});", "delay({2});\n"],
                loop: ["tone({0},{1},{2});", "delay({2});\n"]
            }
        },
        // basicInputNumber: {
        //     output: 'int',
        //     color: '#e2e2e2',
        //     text:[["number",{input:'userInput', type:"number",label:"number"}]],
        //     code: {setup:'{0}', loop:'{0}'}
        // }
    };
    return data;
};