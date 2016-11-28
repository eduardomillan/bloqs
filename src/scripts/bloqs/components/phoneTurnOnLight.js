/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: phoneToggleLight
 *
 * Bloq type: Statement
 *
 * Description: It sends a message to mobile by bluetooth
 *
 * Return type: none
 */

var phoneTurnOnLight = _.merge(_.clone(StatementBloq, true), {

    name: 'phoneTurnOnLight',
    bloqClass: 'bloq-phone-turnon-light',
    content: [
        [{
            alias: 'text',
            value: 'bloq-phone-turnon-light'
        }, {
            id: 'PHONE',
            alias: 'dynamicDropdown',
            options: 'phoneElements'
        }, {
            alias: 'text',
            value: 'bloq-phone-turnon-light'
        }, {
            bloqInputId: 'DATA',
            alias: 'bloqInput',
            acceptType: ['all'],
            suggestedBloqs: ['number', 'selectVariable']
        }, {
            alias: 'text',
            value: '%'
        }]
    ],
    code: '{PHONE}.println("write-" + {DATA});',

    arduino: {
        includes: ['BitbloqSoftwareSerial.h'],
        code: '{PHONE}.println(String("toggleFlashlight-")+String({DATA}));'
    }

});
utils.generateBloqInputConnectors(phoneTurnOnLight);

module.exports = phoneTurnOnLight;
