/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: readSensor
 *
 * Bloq type: Output
 *
 * Description: It returns the measurement of a specific
 *              sensor, selectable from a drop-down.
 *
 * Return type: sensor's return type
 */

var phoneReceive = _.merge(_.clone(OutputBloq, true), {
    name: 'phoneReceive',
    bloqClass: 'bloq-receive-device',
    content: [
        [{
            id: 'DEVICE',
            alias: 'dynamicDropdown',
            options: 'phoneElements'
        }, {
            alias: 'text',
            value: 'bloq-phone-receive'
        }]
    ],
    code: '{DEVICE}.readString()',
    arduino: {
        includes: ['BitbloqSoftwareSerial.h'],
        code: '{DEVICE}.readString()'
    },
    returnType: {
        type: 'simple',
        value: 'String'
    }
});

utils.generateBloqInputConnectors(phoneReceive);

module.exports = phoneReceive;
