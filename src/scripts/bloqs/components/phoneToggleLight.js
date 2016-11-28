/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: phoneSendText
 *
 * Bloq type: Statement
 *
 * Description: It sends a message to mobile by bluetooth
 *
 * Return type: none
 */

var phoneToggleLight = _.merge(_.clone(StatementBloq, true), {

    name: 'phoneToggleLight',
    bloqClass: 'bloq-phone-toggle',
    content: [
        [{
            id: 'PHONE',
            alias: 'dynamicDropdown',
            options: 'phoneElements'
        }, {
            alias: 'text',
            value: 'bloq-phone-toggle-light'
        }, {
            bloqInputId: 'DATA',
            alias: 'bloqInput',
            acceptType: ['all'],
            suggestedBloqs: ['number', 'selectVariable']
        },  {
            alias: 'text',
            value: 'bloq-phone-toggle-units'
        }]
    ],
    code: '{PHONE}.println("write-" + {DATA});',

    arduino: {
        includes: ['BitbloqSoftwareSerial.h'],
        code: '{PHONE}.println(String("toggleFlashlight-")+String({DATA}));'
    }

});
utils.generateBloqInputConnectors(phoneToggleLight);

module.exports = phoneToggleLight;
