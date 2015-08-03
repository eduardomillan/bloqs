/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    StatementBloq = require('./../../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'servoNormalAdvanced',
    bloqClass: 'bloq-servo-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-servo-advanced-move'
        }, {
            bloqInputId: 'SERVO',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-servo-advanced-to'
        }, {
            bloqInputId: 'POSITION',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-servo-advanced-degrees'
        }]
    ],
    code: '{SERVO}.write({POSITION});'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;
