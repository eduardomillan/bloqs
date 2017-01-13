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

var phoneReadMagnetic = _.merge(_.clone(OutputBloq, true), {
    name: 'phoneReadMagnetic',
    bloqClass: 'bloq-phone-read-magnetic',
    content: [
        [{
            alias: 'text',
            value: 'bloq-phone-magnetic'
        },  {
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
        },{
            alias: 'text',
            value: 'bloq-phone-of'
        }, {
            id: 'PHONE',
            alias: 'dynamicDropdown',
            options: 'serialElements'
        },{
            alias: 'text',
            value: '(μT)'
        }, ]
    ],
    code: '{PHONE}.readString()',
    arduino: {
        includes: ['BitbloqSoftwareSerial.h'],
        extraFunctionCode: 'float getMagneticField(String axis,bqSoftwareSerial & phone){phone.println(String("readMagnetic-")+String(axis));String data="";while(data==""){data=phone.readString();}return data.toFloat();}',
        code: 'getMagneticField({AXIS}, {PHONE})'
    },
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.preprocessBloq(phoneReadMagnetic);

module.exports = phoneReadMagnetic;
