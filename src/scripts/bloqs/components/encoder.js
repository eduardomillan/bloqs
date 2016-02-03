//--IN PROGRESS--//

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: encoder
 *
 * Bloq type: Output
 *
 * Description: It returns the humidity measurement from a
 *              specific humidity & temperature sensor, selectable
 *              from a drop-down.
 *
 * Return type: float
 */

var encoder = _.merge(_.clone(OutputBloq, true), {

    name: 'encoder',
    bloqClass: 'bloq-encoder',
    content: [
        [{
            alias: 'text',
            value: 'Leer'
        }, {
            id: 'FUNCTION',
            alias: 'staticDropdown',
            options: [{
                label: 'pasos',
                value: ''
            }, {
                label: 'boton',
                value: ''
            }]
        }, {
            alias: 'text',
            value: 'del encoder'
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

utils.generateBloqInputConnectors(encoder);

module.exports = encoder;