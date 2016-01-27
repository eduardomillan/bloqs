//---IN PROGGRESS---//

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: PTSensorPressure
 *
 * Bloq type: Output
 *
 * Description: It returns a the pressure measurement
 *              of a specific preassure sensor,
 *              selectable from a second drop-down.
 *
 * Return type: float
 */


var PTSensorPressure = _.merge(_.clone(OutputBloq, true), {
    name: 'PTSensorPressure',
    bloqClass: 'bloq-PT-sensor-pressure',
    content: [
        [{
            alias: 'text',
            value: 'Leer la presión del sensor'
        }, {
            id: 'PTSENS',
            alias: 'dynamicDropdown',
            options: 'hts221'       //CHANGE TO 'barometer'
        }]
    ],
    code: '{PTSENS}.getPressure()',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(PTSensorPressure);

module.exports = PTSensorPressure;