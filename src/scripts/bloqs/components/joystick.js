//--IN PROGRESS--//

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: joystick
 *
 * Bloq type: Output
 *
 * Description: It returns the humidity measurement from a
 *              specific humidity & temperature sensor, selectable
 *              from a drop-down.
 *
 * Return type: float
 */

var joystick = _.merge(_.clone(OutputBloq, true), {

    name: 'joystick',
    bloqClass: 'bloq-joystick',
    content: [
        [{
            alias: 'text',
            value: 'Leer el'
        }, {
            id: 'FUNCTION',
            alias: 'staticDropdown',
            options: [{
                label: 'desplazamiento X',
                value: ''
            }, {
                label: 'desplazamiento Y',
                value: ''
            }, {
                label: 'botón',
                value: ''
            }]
        }, {
            alias: 'text',
            value: 'del joystick'
        }, {
            id: 'SENSOR',
            alias: 'dynamicDropdown',
            options: 'hts221'
        }]
    ],
    code: '',
    returnType: {
        type: 'simple',
        value: 'float'
    }

});

utils.generateBloqInputConnectors(joystick);

module.exports = joystick;