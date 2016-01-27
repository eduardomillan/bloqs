//---IN PROGGRESS---//

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: PTSensorTemperature
 *
 * Bloq type: Output
 *
 * Description: It returns a the temperature measurement
 *              of a specific preassure sensor,
 *              selectable from a second drop-down.
 *
 * Return type: float
 */


var PTSensorTemperature = _.merge(_.clone(OutputBloq, true), {
    name: 'PTSensorTemperature',
    bloqClass: 'bloq-PT-sensor-temperature',
    content: [
        [{
            alias: 'text',
            value: 'Leer la temperatura del sensor'
        }, {
            id: 'PTSENS',
            alias: 'dynamicDropdown',
            options: 'hts221'       //CHANGE TO 'barometer'
        }]
    ],
    code: '{PTSENS}.getTemperature()',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(PTSensorTemperature);

module.exports = PTSensorTemperature;