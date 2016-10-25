/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: serialReceive
 *
 * Bloq type: Output
 *
 * Description: It returns what is received by the serial port.
 *
 * Return type: String
 */

var serialReceiveInt = _.merge(_.clone(OutputBloq, true), {

    name: 'serialReceiveInt',
    bloqClass: 'bloq-serial-receive-number',
    content: [
        [{
            id: 'SERIAL',
            alias: 'dynamicDropdown',
            options: 'serialElements'
        }, {
            alias: 'text',
            value: 'bloq-serial-receiver-receive-number'
        }]
    ],
    code: '{SERIAL}.readInt()',
    arduino: {
        includes: ['BitbloqSoftwareSerial.h'],
        code: '{SERIAL}.readInt()'
    },
    returnType: {
        type: 'simple',
        value: 'int'
    }
});
utils.generateBloqInputConnectors(serialReceiveInt);

module.exports = serialReceiveInt;