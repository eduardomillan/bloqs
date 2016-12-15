/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: mRangerSetLedAdvanced
 *
 * Bloq type: Statement
 *
 *
 *
 */

var mRangerSetLedAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'mRangerSetLedAdvanced',
    bloqClass: 'bloq-mranger-setled',
    content: [
        [{
            alias: 'text',
            value: 'bloq-mbot-setled-set'
        }, {
            bloqInputId: 'LEDS',
            alias: 'bloqInput',
            acceptType: ['float'],
            suggestedBloqs: ['number', 'selectVariable']
        }, {
            alias: 'text',
            value: 'bloq-mbot-setled-colormix'
        }, {
            alias: 'text',
            value: 'bloq-mbot-setled-red'
        }, {
            bloqInputId: 'RED',
            alias: 'bloqInput',
            acceptType: ['float'],
            suggestedBloqs: ['number', 'selectVariable']
        }, {
            alias: 'text',
            value: 'bloq-mbot-setled-green'
        }, {
            bloqInputId: 'GREEN',
            alias: 'bloqInput',
            acceptType: ['float'],
            suggestedBloqs: ['number', 'selectVariable']
        }, {
            alias: 'text',
            value: 'bloq-mbot-setled-blue'
        }, {
            bloqInputId: 'BLUE',
            alias: 'bloqInput',
            acceptType: ['float'],
            suggestedBloqs: ['number', 'selectVariable']
        }]
    ],
    code: '',
    arduino: {
        includes: ['BitbloqMRanger.h'],
        needInstanceOf: [{
            name: 'mRanger',
            type: 'MRanger'
        }],
        code: 'mRanger.setLed({LEDS}, {RED}, {GREEN}, {BLUE});'
    }
});

utils.preprocessBloq(mRangerSetLedAdvanced);

module.exports = mRangerSetLedAdvanced;