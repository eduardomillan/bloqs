/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: mRangerSetLed
 *
 * Bloq type: Statement
 *
 *
 *
 */

var mRangerSetLed = _.merge(_.clone(StatementBloq, true), {

    name: 'mRangerSetLed',
    bloqClass: 'bloq-mranger-setled',
    content: [
        [{
            alias: 'text',
            value: 'bloq-mranger-setled-set'
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
        }, {
            alias: 'text',
            value: 'bloq-mbot-setled-colormix'
        }, {
            alias: 'text',
            value: 'bloq-mbot-setled-red'
        }, {
            id: 'RED',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: 'bloq-mbot-setled-green'
        }, {
            id: 'GREEN',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: 'bloq-mbot-setled-blue'
        }, {
            id: 'BLUE',
            alias: 'numberInput',
            value: 0
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

utils.preprocessBloq(mRangerSetLed);

module.exports = mRangerSetLed;