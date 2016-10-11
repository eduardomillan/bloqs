/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: mBotBuzzerAdvanced
 *
 * Bloq type: Statement
 *
 * Description: It turns on a specific buzzer, selectable
 *              from a first drop-down, with a basic note,
 *              selectable from a second drop-down, during
 *              a given period of time.
 *
 * Return type: none
 */

var mBotBuzzerAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'mBotBuzzerAdvanced',
    bloqClass: 'bloq-mbot-buzzer',
    content: [
        [{
            alias: 'text',
            value: 'Hacer sonar la nota'
        }, {
            bloqInputId: 'NOTE',
            alias: 'bloqInput',
            acceptType: ['float'],
            suggestedBloqs: ['number', 'selectVariable']
        }, {
            alias: 'text',
            value: 'beat'
        }, {
            bloqInputId: 'BEAT',
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
        code: 'mBot.tone({NOTE},{BEAT});'
    }
});
utils.generateBloqInputConnectors(mBotBuzzerAdvanced);

module.exports = mBotBuzzerAdvanced;