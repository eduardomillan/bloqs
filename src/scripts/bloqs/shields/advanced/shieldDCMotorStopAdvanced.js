/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: shieldDCMotorStopAdvanced
 *
 * Bloq type: statement
 *
 * Description: It stops a specific motor, selectable from a drop-down,
 *              connected to the shield.
 * 
 * Return type: none
 */

var shieldDCMotorStopAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'shieldDCMotorStopAdvanced',
    bloqClass: 'bloq-shield-DCmotor-stop-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-shield-DCmotor-stop-advanced'
        }, {
            bloqInputId: 'MOTOR',
            alias: 'bloqInput',
            acceptType: 'float'
        }, ]
    ],
    code: 'dcmotorshield.stopMotor({MOTOR});'
});

utils.generateBloqInputConnectors(shieldDCMotorStopAdvanced);

module.exports = shieldDCMotorStopAdvanced;