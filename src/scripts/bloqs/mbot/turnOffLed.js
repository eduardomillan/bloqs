/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: mBotTurnOffLed
 *
 * Bloq type: Statement
 *
 *
 *
 */

var mBotTurnOffLed = _.merge(_.clone(StatementBloq, true), {

    name: 'mBotTurnOffLed',
    bloqClass: 'bloq-mbot-turnoffled',
    content: [
        [{
            alias: 'text',
            value: 'Apagar '
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
        }]
    ],
    code: '',
    arduino: {
        includes: ['BitbloqMBot.h'],
        needInstanceOf: [{
            name: 'mBot',
            type: 'MBot'
        }],
        code: 'mBot.setLed({LEDS}, 0, 0, 0);'
    }
});

utils.generateBloqInputConnectors(mBotTurnOffLed);

module.exports = mBotTurnOffLed;