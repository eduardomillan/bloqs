/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: shieldDCMotorSpinAdvancedAdvanced
 *
 * Bloq type: statement
 *
 * Description: It spins a specific motor connected to the shield
 *              on a specific direction at a cestain percentage of
 *              its maximum speed.
 *
 * Return type: none
 */

var shieldDCMotorSpinAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'shieldDCMotorSpinAdvanced',
    bloqClass: 'bloq-shield-DCmotor-spinMotor-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-shield-DCmotor-spinMotor-advanced'
        }, {
            bloqInputId: 'MOTOR',
            alias: 'bloqInput',
            acceptType: 'float'
        }, {
            alias: 'text',
            value: 'bloq-shield-DCmotor-spinMotor-advanced-direction'
        }, {
            bloqInputId: 'DIRECTION',
            alias: 'bloqInput',
            acceptType: 'float'
        }, {
            alias: 'text',
            value: 'bloq-shield-DCmotor-spinMotor-advanced-at'
        }, {
            bloqInputId: 'PERCENTAGE',
            alias: 'bloqInput',
            acceptType: 'float'
        }, {
            alias: 'text',
            value: 'bloq-shield-DCmotor-spinMotor-advanced-speed'
        }, ]
    ],
    code: 'dcmotorshield.spinMotor({MOTOR},{DIRECTION},{PERCENTAGE});'
});

utils.generateBloqInputConnectors(shieldDCMotorSpinAdvanced);

module.exports = shieldDCMotorSpinAdvanced;