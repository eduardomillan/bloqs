//--IN PROGRESS--//

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: linefollower
 *
 * Bloq type: Output
 *
 * Description: It returns the humidity measurement from a
 *              specific humidity & temperature sensor, selectable
 *              from a drop-down.
 *
 * Return type: float
 */

var linefollower = _.merge(_.clone(OutputBloq, true), {

    name: 'linefollower',
    bloqClass: 'bloq-linefollower',
    content: [
        [{
            alias: 'text',
            value: 'Leer el'
        }, {
            id: 'FUNCTION',
            alias: 'staticDropdown',
            options: [{
                label: 'sensor 1',
                value: ''
            }, {
                label: 'sensor 2',
                value: ''
            }]
        }, {
            alias: 'text',
            value: 'del sigue líneas'
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

utils.generateBloqInputConnectors(linefollower);

module.exports = linefollower;