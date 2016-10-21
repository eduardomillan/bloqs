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
            value: 'bloq-mbot-turnoffled-off'
        }, {
            id: 'LEDS',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-mbot-led-all',
                value: '0'
            }, {
                label: 'bloq-mbot-led-right',
                value: '1'
            }, {
                label: 'bloq-mbot-led-left',
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