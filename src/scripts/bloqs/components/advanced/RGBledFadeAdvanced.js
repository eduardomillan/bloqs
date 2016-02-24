/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: rgbLedFadeAdvanced
 *
 * Bloq type: Statement
 *
 * Description: It fades a specific rgb led, selectable from
 *              a drop-down, from the previous state to a given
 *              combination of each basic colour.
 *
 * Return type: none
 */

var rgbLedFadeAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'rgbLedFadeAdvanced',
    bloqClass: 'bloq-rgbLed-fade-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-rgbLed-fade'
        }, {
            id: 'LED',
            alias: 'dynamicDropdown',
            options: 'rgbs'
        }, {
            alias: 'text',
            value: 'bloq-rgbLed-fade-red'
        }, {
            bloqInputId: 'RED',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-rgbLed-fade-green'
        }, {
            id: 'GREEN',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-rgbLed-fade-blue'
        }, {
            id: 'BLUE',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{LED}.crossFade({RED},{GREEN},{BLUE});'
});

utils.generateBloqInputConnectors(rgbLedFadeAdvanced);

module.exports = rgbLedFadeAdvanced;