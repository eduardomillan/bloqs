/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {
    name: 'case',
    bloqClass: 'bloq-case',
    content: [
        [{
            alias: 'text',
            value: 'bloq-case-ifSameTo'
        }, {
            id: 'VAR',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: 'bloq-case-exec'
        }]
    ],
    code: 'case {VAR}:{{STATEMENTS}break;}'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;