/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: mbot-
 *
 * Bloq type: Statement-Input
 *
 * Description:
 *
 * Return type: none
 */

var robotSetMotorSpeed = _.merge(_.clone(StatementBloq, true), {

    name: 'robotSetMotorSpeed',
    bloqClass: 'bloq-components-color',
    content: [
        [{
            alias: 'text',
            value: 'Mover el motor'
        }, {
            id: 'DIRECTION',
            alias: 'staticDropdown',
            options: [{
                label: 'Derecho',
                value: 'Right'
            }, {
                label: 'izquierdo',
                value: 'Left'
            }]
        }, {
            alias: 'text',
            value: 'a una velocidad de'
        }, {
            id: 'SPEED',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: '(-200,200)'
        }]
    ],
    code: '',
    arduino: {
        code: 'robot.set{DIRECTION}MotorSpeed({SPEED});'
    }
});

utils.preprocessBloq(robotSetMotorSpeed);


module.exports = robotSetMotorSpeed;