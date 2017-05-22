/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementInputBloq = require('./../../statementInputBloq');

/**
 * Bloq name: mbot-SomethingNear
 *
 * Bloq type: Statement-Input
 *
 * Description:
 *
 * Return type: none
 */

var bloqMBotSomethingNear = _.merge(_.clone(StatementInputBloq, true), {

    name: 'redJoystickXY',
    bloqClass: 'bloq-mbot-somethingnear',
    content: [
        [{
            alias: 'text',
            value: 'bloq-read-mkb_joystick'
        }, {
            id: 'OPTION',
            alias: 'staticDropdown',
            options: [{
                label: 'X',
                value: 'X'
            }, {
                label: 'Y',
                value: 'Y'
            }]
        }, {
            alias: 'text',
            value: 'bloq-of-joystick'
        }, {
            id: 'JOYSTICK',
            alias: 'dynamicDropdown',
            options: 'joystick'
        }]
    ],
    code: '',
    arduino: {
        conditional: {
            aliasId: 'OPERATION',
            code: {
                'X': '{{JOYSTICK}}.readPinX()',
                'Y': '{{JOYSTICK}}.readPinY()'
            }
        }
    }
});

utils.preprocessBloq(bloqMBotSomethingNear);
bloqMBotSomethingNear.connectors[1].acceptedAliases = ['all', 'ifDown'];


module.exports = bloqMBotSomethingNear;