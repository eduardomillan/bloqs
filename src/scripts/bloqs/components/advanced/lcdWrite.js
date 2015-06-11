/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    StatementBloq = require('./../../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'lcdWriteAdvanced',
    bloqClass: 'bloq-lcd-writte-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-lcd-writte-advanced-write'
        }, {
            bloqInputId: 'TEXT',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-lcd-writte-advanced-inLCD'
        }, {
            bloqInputId: 'LCD',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{LCD}.print({TEXT});'

});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;