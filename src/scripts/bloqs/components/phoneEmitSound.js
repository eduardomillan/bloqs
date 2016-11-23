/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: phoneEmitSound
 *
 * Bloq type: statement
 *
 * Description: It makes mobile emit a sound.
 *
 * Return type: none
 */

var phoneEmitSound = _.merge(_.clone(StatementBloq, true), {

    name: 'phoneEmitSound',
    bloqClass: 'bloq-zowi-gestures',
    content: [
        [{
            alias: 'text',
            value: 'bloq-phone-sounds'
        }, {
            id: 'SOUND',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-phone-sounds-ambient-v1',
                value: '"ambient"'
            }, {
                label: 'bloq-phone-sounds-bass-v1',
                value: '"bass"'
            }, {
                label: 'bloq-phone-sounds-bongo-v1',
                value: '"bongo"'
            }, {
                label: 'bloq-phone-sounds-highhat-v1',
                value: '"highhat"'
            }, {
                label: 'bloq-phone-sounds-snare-v1',
                value: '"snare"'
            }]
        }, {
            alias: 'text',
            value: 'bloq-phone-sounds-device'
        }, {
            id: 'PHONE',
            alias: 'dynamicDropdown',
            options: 'phoneElements'
        }]
    ],
    code: '{PHONE}.println("playSound-" + {SOUND});',

    arduino: {
        includes: ['BitbloqSoftwareSerial.h'],
        code: '{PHONE}.println(String("playSound-")+String({SOUND}));'
    }
});
utils.generateBloqInputConnectors(phoneEmitSound);

module.exports = phoneEmitSound;
