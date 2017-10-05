/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../../build-utils'),
    StatementBloq = require('./../../../../statementBloq');

/**
 * Bloq name: mkbSetExternalRGBLedAdvanced
 *
 * Bloq type: Statement
 *
 * Description: It switches on a specific rgb led, selectable
 *              from a first drop-down, with the selectable colour
 *              from a second drop-down.
 *
 * Return type: none
 */

var mkbSetExternalRGBLedAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'mkbSetExternalRGBLedAdvanced',
    bloqClass: 'bloq-mbot-setrgbLed',
    content: [
        [{
            alias: 'text',
            value: 'bloq-rgbLed'
        }, {
            id: 'LED',
            alias: 'dynamicDropdown',
            options: 'mkb_integrated_RGB'
        }, {
            alias: 'text',
            value: 'bloq-rgbLed-red'
        }, {
            bloqInputId: 'RED',
            alias: 'bloqInput',
            acceptType: ['all'],
            suggestedBloqs: ['number', 'selectVariable']
        }, {
            alias: 'text',
            value: 'bloq-rgbLed-green'
        }, {
            bloqInputId: 'GREEN',
            alias: 'bloqInput',
            acceptType: ['all'],
            suggestedBloqs: ['number', 'selectVariable']
        }, {
            alias: 'text',
            value: 'bloq-rgbLed-blue'
        }, {
            bloqInputId: 'BLUE',
            alias: 'bloqInput',
            acceptType: ['all'],
            suggestedBloqs: ['number', 'selectVariable']
        }, {
            alias: 'text',
            value: 'in'
        }, {
            id: 'RGBLED',
            alias: 'dynamicDropdown',
            options: 'mkb_RGBLed'
        }]
    ],
    code: '',
    arduino: {
        code: '{RGBLED}.showColor({LED},{RED}, {GREEN}, {BLUE});'
    }

});

utils.preprocessBloq(mkbSetExternalRGBLedAdvanced);

module.exports = mkbSetExternalRGBLedAdvanced;