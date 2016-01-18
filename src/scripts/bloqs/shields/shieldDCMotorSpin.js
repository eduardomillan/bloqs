/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: shieldDCMotorSpin
 *
 * Bloq type: statement
 *
 * Description: It spins a specific motor, selectable from a first drop-down,
 *              connected to the shield on a specific direction, selectable from
 *              a second drop-down, at a cestain percentage of its maximum speed.
 *
 * Return type: none
 */

var shieldDCMotorSpin = _.merge(_.clone(StatementBloq, true), {

    name: 'shieldDCMotorSpin',
    bloqClass: 'bloq-shield-DCmotor-spin',
    content: [
        [{
            alias: 'text',
            value: 'bloq-shield-DCmotor-spin'
        }, {
            id: 'MOTOR',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-shield-DCmotor-spin-motor1',
                value: 'MOTOR1'
            }, {
                label: 'bloq-shield-DCmotor-spin-motor2',
                value: 'MOTOR2'
            }]
        }, {
            alias: 'text',
            value: 'bloq-shield-DCmotor-spin-direction'
        }, {
            id: 'DIRECTION',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-shield-DCmotor-spin-CW',
                value: 'CW'
            }, {
                label: 'bloq-shield-DCmotor-spin-CCW',
                value: 'CCW'
            }]
        }, {
            alias: 'text',
            value: 'bloq-shield-DCmotor-spin-at'
        }, {
            id: 'PERCENTAGE',
            alias: 'numberInput',
            value: 50
        }, {
            alias: 'text',
            value: 'bloq-shield-DCmotor-spin-speed'
        }, ]
    ],
    code: 'dcmotorshield.spinMotor({MOTOR},{DIRECTION},{PERCENTAGE});'
});

utils.generateBloqInputConnectors(shieldDCMotorSpin);

module.exports = shieldDCMotorSpin;