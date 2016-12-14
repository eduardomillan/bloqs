/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: mRangerTurnOffLed
 *
 * Bloq type: Statement
 *
 *
 *
 */

var mRangerTurnOffLed = _.merge(_.clone(StatementBloq, true), {

    name: 'mRangerTurnOffLed',
    bloqClass: 'bloq-mranger-turnoffled',
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
        includes: ['BitbloqMRanger.h'],
        needInstanceOf: [{
            name: 'mRanger',
            type: 'MRanger'
        }],
        code: 'mRanger.setLed({LEDS}, 0, 0, 0);'
    }
});

utils.preprocessBloq(mRangerTurnOffLed);

module.exports = mRangerTurnOffLed;