/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: equidnaReadJoystickXY
 *
 * Bloq type: Statement-Input
 *
 * Description:
 *
 * Return type: none
 */

var equidnaReadJoystickXY = _.merge(_.clone(OutputBloq, true), {

    name: 'equidnaReadJoystickXY',
    bloqClass: 'bloq-components-color',
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
        }]
    ],
    returnType: {
        type: 'simple',
        value: 'float'
    },
    arduino: {
        conditional: {
            aliasId: 'OPTION',
            code: {
                'X': 'equidna.readJoystickX()',
                'Y': 'equidna.readJoystickY()'
            }
        }
    }
});

utils.preprocessBloq(equidnaReadJoystickXY);

module.exports = equidnaReadJoystickXY;