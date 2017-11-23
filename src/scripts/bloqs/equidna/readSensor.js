/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: equidnareadSensor
 *
 * Bloq type: Output
 *
 * Description: It returns the measurement of a specific
 *              sensor, selectable from a drop-down.
 *
 * Return type: sensor's return type
 */

var equidnareadSensor = _.merge(_.clone(OutputBloq, true), {

    name: 'equidnaReadSensor',
    bloqClass: 'bloq-read-sensor',
    content: [
        [{
            alias: 'text',
            value: 'bloq-read-read'
        }, {
            id: 'SENSOR',
            alias: 'staticDropdown',
            options: [{
                label: 'equidna-button-1',
                value: 'readButton1'
            }, {
                label: 'equidna-button-2',
                value: 'readButton2'
            }, {
                label: 'equidna-ldrs',
                value: 'readLightSensor'
            }, {
                label: 'equidna-joystick-button',
                value: 'readJoystickButton'
            }]
        }]
    ],
    returnType: {
        type: 'simple',
        value: 'float'
    },
    arduino: {
        code: 'equidna.{SENSOR}()'
    }
});

utils.preprocessBloq(equidnareadSensor);

module.exports = equidnareadSensor;