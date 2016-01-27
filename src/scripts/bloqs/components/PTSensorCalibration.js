//---IN PROGGRESS---//

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: PTSensorCalibration
 *
 * Bloq type: Statement
 *
 * Description: It stablish the sea level pressure to calibrate the sensor
 *
 * Return type: none
 */

var PTSensorCalibration = _.merge(_.clone(StatementBloq, true), {

    name: 'PTSensorCalibration',
    bloqClass: 'bloq-PT-sensor-calibration',
    content: [
        [{
            alias: 'text',
            value: 'Definir la presión a nivel del mar a'
        }, {
            id: 'VALUE',
            alias: 'numberInput',
            value: 101325
        }, {
            alias: 'text',
            value: 'Pa en el sensor'
        }, {
            id: 'PTSENS',
            alias: 'dynamicDropdown',
            options: 'hts221'       //CHANGE TO 'barometer'
        }]
    ],
    code: '{PTSENS}.setSealevelPressure({VALUE}));'

});

utils.generateBloqInputConnectors(PTSensorCalibration);

module.exports = PTSensorCalibration;