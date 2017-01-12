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

var phoneReadOrientation = _.merge(_.clone(OutputBloq, true), {
    name: 'phoneReadOrientation',
    bloqClass: 'bloq-phone-read-orientation',
    content: [
        [{
            alias: 'text',
            value: 'bloq-value'
        }, {
            id: 'AXIS',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-phone-orientation-azimuth',
                value: '"azimuth"'
            }, {
                label: 'bloq-phone-orientation-roll',
                value: '"roll"'
            }, {
                label: 'bloq-phone-orientation-pitch',
                value: '"pitch"'
            }]
        }, {
            alias: 'text',
            value: 'bloq-phone-of'
        }, {
            id: 'PHONE',
            alias: 'dynamicDropdown',
            options: 'phoneElements'
        }, {
            alias: 'text',
            value: '(º)'
        }, ]
    ],
    code: '{PHONE}.readString()',
    arduino: {
        includes: ['BitbloqSoftwareSerial.h'],
        extraFunctionCode: 'float getOrientation(String axis,bqSoftwareSerial & phone){phone.println(String("readOrientation-")+String(axis));String data="";while(data==""){data=phone.readString();}return data.toFloat();}',
        code: 'getOrientation({AXIS}, {PHONE})'
    },
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.preprocessBloq(phoneReadOrientation);

module.exports = phoneReadOrientation;
