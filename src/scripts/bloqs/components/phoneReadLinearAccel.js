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

var phoneReadLinearAccel = _.merge(_.clone(OutputBloq, true), {
    name: 'phoneReadLinearAccel',
    bloqClass: 'bloq-phone-read-laccel',
    content: [
        [{
            alias: 'text',
            value: 'bloq-phone-read'
        },{
            id: 'PHONE',
            alias: 'dynamicDropdown',
            options: 'phoneElements'
        }, {
            alias: 'text',
            value: 'bloq-phone-lacceleration'
        },
        {
            id: 'AXIS',
            alias: 'staticDropdown',
            options: [{
                label: '"x"',
                value: '"x"'
            }, {
                label: '"x"',
                value: '"y"'
            }, {
                label: '"z"',
                value: '"z"'
            }]
        },
         {
            alias: 'text',
            value: 'm/s²'
        },
      ]
    ],
    code: '{PHONE}.readString()',
    arduino: {
        includes: ['BitbloqSoftwareSerial.h'],
        extraFunctionCode: 'float getAcceleration(String axis,bqSoftwareSerial & phone){phone.println(String("readLAccel-")+String(axis));String data="";while(data==""){data=phone.readString();}return data.toFloat();}',
        code:'getAcceleration({AXIS}, {PHONE})'
    },
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.preprocessBloq(phoneReadLinearAccel);

module.exports = phoneReadLinearAccel;
