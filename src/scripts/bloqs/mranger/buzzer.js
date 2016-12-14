/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: mRangerBuzzer
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

var mRangerBuzzer = _.merge(_.clone(StatementBloq, true), {

    name: 'mRangerBuzzer',
    bloqClass: 'bloq-mranger-buzzer',
    content: [
        [{
            alias: 'text',
            value: 'bloq-mranger-buzzer-note'
        }, {
            id: 'NOTE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-buzzer-do',
                value: '261'
            }, {
                label: 'bloq-buzzer-re',
                value: '293'
            }, {
                label: 'bloq-buzzer-mi',
                value: '329'
            }, {
                label: 'bloq-buzzer-fa',
                value: '349'
            }, {
                label: 'bloq-buzzer-sol',
                value: '392'
            }, {
                label: 'bloq-buzzer-la',
                value: '440'
            }, {
                label: 'bloq-buzzer-si',
                value: '494'
            }, {
                label: 'bloq-buzzer-do-#',
                value: '277'
            }, {
                label: 'bloq-buzzer-re-#',
                value: '311'
            }, {
                label: 'bloq-buzzer-fa-#',
                value: '370'
            }, {
                label: 'bloq-buzzer-sol-#',
                value: '415'
            }, {
                label: 'bloq-buzzer-la-#',
                value: '466'
            }]
        }, {
            alias: 'text',
            value: 'bloq-mbot-buzzer-for'
        }, {
            id: 'SECONDS',
            alias: 'numberInput',
            value: 2000
        }, {
            alias: 'text',
            value: 'bloq-mbot-buzzer-ms'
        }]
    ],
    code: '',
    arduino: {
        needInstanceOf: [{
            name: 'mRangerBuzzerPin',
            type: 'const int',
            equals: '8'
        }],
        code: 'tone(mRangerBuzzerPin,{NOTE},{SECONDS});\ndelay({SECONDS});'
    }
});
utils.preprocessBloq(mRangerBuzzer);

module.exports = mRangerBuzzer;