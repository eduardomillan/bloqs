/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: mBotSetLedAdvanced
 *
 * Bloq type: Statement
 *
 *
 *
 */

var mBotSetLedAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'mBotSetLedAdvanced',
    bloqClass: 'bloq-mbot-setled',
    content: [
        [{
            alias: 'text',
            value: 'Establecer '
        }, {
            id: 'LEDS',
            alias: 'staticDropdown',
            options: [{
                label: 'todos los leds',
                value: '0'
            }, {
                label: 'el led derecho',
                value: '1'
            }, {
                label: 'el led izquierdo',
                value: '2'
            }]
        }, {
            alias: 'text',
            value: 'con esta mezcla de colores:'
        }, {
            alias: 'text',
            value: 'rojo:'
        }, {
            bloqInputId: 'RED',
            alias: 'bloqInput',
            acceptType: ['float'],
            suggestedBloqs: ['number', 'selectVariable']
        }, {
            alias: 'text',
            value: 'verde:'
        }, {
            bloqInputId: 'GREEN',
            alias: 'bloqInput',
            acceptType: ['float'],
            suggestedBloqs: ['number', 'selectVariable']
        }, {
            alias: 'text',
            value: 'azul:'
        }, {
            bloqInputId: 'BLUE',
            alias: 'bloqInput',
            acceptType: ['float'],
            suggestedBloqs: ['number', 'selectVariable']
        }]
    ],
    code: '',
    arduino: {
        includes: ['BitbloqMBot.h'],
        needInstanceOf: [{
            name: 'mBot',
            type: 'MBot'
        }],
        code: 'mBot.setLed({LEDS}, {RED}, {GREEN}, {BLUE});'
    }
});

utils.generateBloqInputConnectors(mBotSetLedAdvanced);

module.exports = mBotSetLedAdvanced;