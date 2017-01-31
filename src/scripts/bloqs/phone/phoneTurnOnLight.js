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
        },{
            id: 'PHONE',
            alias: 'dynamicDropdown',
            options: 'serialElements'
        }]
    ],
    code: '{PHONE}.println("turnonFlashlight-");  delay(500);',

    arduino: {
        includes: ['BitbloqSoftwareSerial.h'],
        code: '{PHONE}.println(String("turnonFlashlight-"));  delay(500);'
    }

});
utils.preprocessBloq(phoneTurnOnLight);

module.exports = phoneTurnOnLight;
