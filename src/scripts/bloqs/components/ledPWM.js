/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: ledPWM
 *
 * Bloq type: Statement
 *
 * Description: It switches on or off aspecific led,
 *              selectable from a drop-down.
 *
 * Return type: none
 */

var ledPWM = _.merge(_.clone(StatementBloq, true), {

    name: 'ledPWM',
    bloqClass: 'bloq-ledPWM',
    content: [
        [{
            alias: 'text',
            value: 'Encender el LED'
        }, {
            id: 'LED',
            alias: 'dynamicDropdown',
            options: 'leds'
        }, {
            alias: 'text',
            value: 'al'
        }, {
            id: 'VALUE',
            alias: 'numberInput',
            value: 100
        }, {
            alias: 'text',
            value: '%'
        }]
    ],
    code: '\'SoftPWMSet({LED},\' + (\'{VALUE}\'? Math.round({VALUE}*2.55) : 0) + \');\''
});

utils.generateBloqInputConnectors(ledPWM);

module.exports = ledPWM;