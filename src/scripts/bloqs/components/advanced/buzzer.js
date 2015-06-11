/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    StatementBloq = require('./../../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'buzzerAdvanced',
    bloqClass: 'bloq-buzzer-advance',
    content: [
        [{
            alias: 'text',
            value: 'bloq-buzzer-advance-sound'
        }, {
            bloqInputId: 'BUZZER',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-buzzer-advance-note'
        }, {
            bloqInputId: 'NOTE',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-buzzer-advance-for'
        }, {
            bloqInputId: 'SECONDS',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-buzzer-advance-ms'
        }]
    ],
    code: 'tone({BUZZER},{NOTE},{SECONDS});\ndelay({SECONDS});'
});
utils.generateBloqInputConnectors(bloq);

module.exports = bloq;