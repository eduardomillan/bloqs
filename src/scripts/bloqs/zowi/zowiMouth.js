/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'zowiMouth',
    bloqClass: 'bloq-zowi-mouth',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-mouth'
        }, {
            id: 'GESTURE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-mouth-smile',
                value: 'smile_code'
            }, {
                label: 'bloq-zowi-mouth-sad',
                value: 'sad_code'
            }, {
                label: 'bloq-zowi-mouth-happy',
                value: 'happyOpen_code'
            }, {
                label: 'bloq-zowi-mouth-confused',
                value: 'confused_code'
            }, {
                label: 'bloq-zowi-mouth-bigSurprise',
                value: 'bigSurprise_code'
            }, {
                label: 'bloq-zowi-mouth-tongueOut',
                value: 'tongueOut_code'
            }]
        }, {
            alias: 'text',
            value: 'bloq-zowi-mouth-mouth'
        }]
    ],
    code: 'zowi.putMouth({GESTURE}, false);'
});
utils.generateBloqInputConnectors(bloq);

module.exports = bloq;