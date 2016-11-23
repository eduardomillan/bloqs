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

var phoneSendText = _.merge(_.clone(StatementBloq, true), {

    name: 'phoneSendText',
    bloqClass: 'bloq-phone-write',
    content: [
        [{
            id: 'PHONE',
            alias: 'dynamicDropdown',
            options: 'phoneElements'
        }, {
            alias: 'text',
            value: 'bloq-serial-send-send'
        },
        {
            bloqInputId: 'DATA',
            alias: 'bloqInput',
            acceptType: ['all'],
            suggestedBloqs: ['string', 'number', 'selectVariable']
        }]
    ],
    code: '{PHONE}.println("write-" + {DATA});',

    arduino: {
        includes: ['BitbloqSoftwareSerial.h'],
        code: '{PHONE}.println(String("write-")+String({DATA}));'
    }

});
utils.generateBloqInputConnectors(phoneSendText);

module.exports = phoneSendText;
