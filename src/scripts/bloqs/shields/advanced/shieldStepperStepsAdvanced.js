/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: shieldStepperStepsAdvanced
 *
 * Bloq type: statement
 *
 * Description: It moves one or both stepper motors connected to
 *              the shield, the given number of degrees on a
 *              specific direction at a certain speed.
 *
 * Return type: none
 */

var shieldStepperStepsAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'shieldStepperStepsAdvanced',
    bloqClass: 'bloq-shield-stepper-steps-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-shield-stepper-steps-advanced'
        }, {
            bloqInputId: 'STEPPER',
            alias: 'bloqInput',
            acceptType: 'float'
        }, {
            bloqInputId: 'DEGREES',
            alias: 'bloqInput',
            acceptType: 'float'
        }, {
            alias: 'text',
            value: 'bloq-shield-stepper-steps-advanced-degdir'
        }, {
            bloqInputId: 'DIRECTION',
            alias: 'bloqInput',
            acceptType: 'float'
        }, {
            alias: 'text',
            value: 'bloq-shield-stepper-steps-advanced-at'
        }, {
            bloqInputId: 'SPEED',
            alias: 'bloqInput',
            acceptType: 'float'
        }, {
            alias: 'text',
            value: 'bloq-shield-stepper-steps-advanced-rpm'
        }, ]
    ],
    code: 'steppershield.step({STEPPER},{DEGREES},{DIRECTION},{SPEED});'
});

utils.generateBloqInputConnectors(shieldStepperStepsAdvanced);

module.exports = shieldStepperStepsAdvanced;