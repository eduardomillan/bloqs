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

var phoneReadAccel = _.merge(_.clone(OutputBloq, true), {
    name: 'phoneReadAccel',
    bloqClass: 'bloq-phone-read-accel',
    content: [
        [{
            alias: 'text',
            value: 'bloq-read-read'
        }, {
            id: 'MESSAGE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-phone-acceleration',
                value: '"readAccel-"'
            }, {
                label: 'bloq-phone-lacceleration',
                value: '"readLAccel-"'
            }, {
                label: 'bloq-phone-gravity',
                value: '"readGravity-"'
            }]
        }, {
            alias: 'text',
            value: 'bloq-phone-axis'
        }, {
            id: 'AXIS',
            alias: 'staticDropdown',
            options: [{
                label: 'x',
                value: '"x"'
            }, {
                label: 'y',
                value: '"y"'
            }, {
                label: 'z',
                value: '"z"'
            }]
        }, {
            alias: 'text',
            value: 'bloq-phone-of'
        }, {
            id: 'PHONE',
            alias: 'dynamicDropdown',
            options: 'serialElements'
        }, {
            alias: 'text',
            value: '(m/s²)'
        }, ]
    ],
    code: '{PHONE}.readString()',
    arduino: {
        includes: ['BitbloqSoftwareSerial.h'],
        extraFunctionCode: 'float getAcceleration(String axis, String message, bqSoftwareSerial & phone){phone.println(String(message)+String(axis));String data="";while(data==""){data=phone.readString();}return data.toFloat();}',
        code: 'getAcceleration({AXIS}, {MESSAGE}, {PHONE})'
    },
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.preprocessBloq(phoneReadAccel);

module.exports = phoneReadAccel;
