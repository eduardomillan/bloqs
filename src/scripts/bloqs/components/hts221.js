//--IN PROGRESS--//

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: hts221
 *
 * Bloq type: Output
 *
 * Description: It returns the humidity measurement from a
 *              specific humidity & temperature sensor, selectable
 *              from a drop-down.
 *
 * Return type: float
 */

var hts221 = _.merge(_.clone(OutputBloq, true), {

    name: 'hts221',
    bloqClass: 'bloq-hts221',
    content: [
        [{
            alias: 'text',
            value: 'Leer la'
        }, {
            id: 'FUNCTION',
            alias: 'staticDropdown',
            options: [{
                label: 'temperatura',
                value: ''
            }, {
                label: 'humedad',
                value: ''
            }]
        }, {
            alias: 'text',
            value: 'del sensor'
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

utils.generateBloqInputConnectors(hts221);

module.exports = hts221;