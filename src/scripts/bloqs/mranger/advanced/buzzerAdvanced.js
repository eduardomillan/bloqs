/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: mRangerBuzzerAdvanced
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

var mRangerBuzzerAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'mRangerBuzzerAdvanced',
    bloqClass: 'bloq-mranger-buzzer',
    content: [
        [{
            alias: 'text',
            value: 'bloq-mbot-buzzer-note'
        }, {
            bloqInputId: 'NOTE',
            alias: 'bloqInput',
            acceptType: ['float'],
            suggestedBloqs: ['number', 'selectVariable']
        }, {
            alias: 'text',
            value: 'bloq-mbot-buzzer-for'
        }, {
            bloqInputId: 'SECONDS',
            alias: 'bloqInput',
            acceptType: ['float'],
            suggestedBloqs: ['number', 'selectVariable']
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
            equals: '45'
        }],
        code: 'tone(mRangerBuzzerPin,{NOTE},{SECONDS});\ndelay({SECONDS});'
    }
});
utils.preprocessBloq(mRangerBuzzerAdvanced);

module.exports = mRangerBuzzerAdvanced;