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
            value: 'bloq-mbot-setled-set'
        }, {
            id: 'LEDS',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-mbot-led-all',
                value: '0'
            }, {
                label: '1',
                value: '1'
            }, {
                label: '2',
                value: '2'
            }, {
                label: '3',
                value: '3'
            }, {
                label: '4',
                value: '4'
            }, {
                label: '5',
                value: '5'
            }, {
                label: '6',
                value: '6'
            }, {
                label: '7',
                value: '7'
            }, {
                label: '8',
                value: '8'
            }, {
                label: '9',
                value: '9'
            }, {
                label: '10',
                value: '10'
            }, {
                label: '11',
                value: '11'
            }, {
                label: '12',
                value: '12'
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