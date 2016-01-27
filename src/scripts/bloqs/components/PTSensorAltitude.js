//---IN PROGGRESS---//

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: PTSensorAltitude
 *
 * Bloq type: Output
 *
 * Description: It returns a the altitude measurement
 *              of a specific preassure sensor,
 *              selectable from a second drop-down.
 *
 * Return type: float
 */


var PTSensorAltitude = _.merge(_.clone(OutputBloq, true), {
    name: 'PTSensorAltitude',
    bloqClass: 'bloq-PT-sensor-altitude',
    content: [
        [{
            alias: 'text',
            value: 'Leer la altitud del sensor'
        }, {
            id: 'PTSENS',
            alias: 'dynamicDropdown',
            options: 'hts221'       //CHANGE TO 'barometer'
        }]
    ],
    code: '{PTSENS}.getAltitude()',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(PTSensorAltitude);

module.exports = PTSensorAltitude;