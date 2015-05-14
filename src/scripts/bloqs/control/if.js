/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'if',
    bloqClass: 'bloq-if',
    content: [
        [{
            alias: 'text',
            value: 'Si'
        }, {
            bloqInputId: 'CONDITION',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'ejecutar:'
        }]
    ],
    code: 'if({CONDITION}){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;