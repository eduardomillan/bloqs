/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'while',
    bloqClass: 'bloq-while',
    content: [
        [{
            alias: 'text',
            value: 'Mientras'
        }, {
            bloqInputId: 'CONDITION',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'ejecutar:'
        }]
    ],
    code: 'while ({CONDITION}){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;