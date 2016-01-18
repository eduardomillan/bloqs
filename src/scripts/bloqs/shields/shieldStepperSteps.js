/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: shieldStepperSteps
 *
 * Bloq type: statement
 *
 * Description: It moves one or both stepper motors connected to
 *              the shield, the given number of degrees on a
 *              specific direction, selectable from a drop down,
 *              at a certain speed.
 *
 * Return type: none
 */

var shieldStepperSteps = _.merge(_.clone(StatementBloq, true), {

    name: 'shieldStepperSteps',
    bloqClass: 'bloq-shield-stepper-steps',
    content: [
        [{
            alias: 'text',
            value: 'bloq-shield-stepper-steps'
        }, {
            id: 'STEPPER',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-shield-stepper-steps-stepper1',
                value: 'STEPPER1'
            }, {
                label: 'bloq-shield-stepper-steps-stepper2',
                value: 'STEPPER2'
            }, {
                label: 'bloq-shield-stepper-steps-stepper12',
                value: 'STEPPER1_2'
            }]
        }, {
            id: 'DEGREES',
            alias: 'numberInput',
            value: 90
        }, {
            alias: 'text',
            value: 'bloq-shield-stepper-steps-degdir'
        }, {
            id: 'DIRECTION',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-shield-stepper-steps-CW',
                value: 'CW'
            }, {
                label: 'bloq-shield-stepper-steps-CCW',
                value: 'CCW'
            }]
        }, {
            alias: 'text',
            value: 'bloq-shield-stepper-steps-at'
        }, {
            id: 'SPEED',
            alias: 'numberInput',
            value: 30
        }, {
            alias: 'text',
            value: 'bloq-shield-stepper-steps-rpm'
        }, ]
    ],
    code: 'steppershield.step({STEPPER},{DEGREES},{DIRECTION},{SPEED});'
});

utils.generateBloqInputConnectors(shieldStepperSteps);

module.exports = shieldStepperSteps;