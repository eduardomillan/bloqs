/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: shieldDCMotorStop
 *
 * Bloq type: statement
 *
 * Description: It stops a specific motor, selectable from a drop-down,
 *              connected to the shield.
 * 
 * Return type: none
 */

var shieldDCMotorStop = _.merge(_.clone(StatementBloq, true), {

    name: 'shieldDCMotorStop',
    bloqClass: 'bloq-shield-DCmotor-stop',
    content: [
        [{
            alias: 'text',
            value: 'bloq-shield-DCmotor-stop'
        }, {
            id: 'MOTOR',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-shield-DCmotor-stop-motor1',
                value: 'MOTOR1'
            }, {
                label: 'bloq-shield-DCmotor-stop-motor2',
                value: 'MOTOR2'
            }]
        }, ]
    ],
    code: 'dcmotorshield.stopMotor({MOTOR});'
});

utils.generateBloqInputConnectors(shieldDCMotorStop);

module.exports = shieldDCMotorStop;