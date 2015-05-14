/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'returnFunctionWithArguments',
    bloqClass: 'bloq-return-function-with-arguments',
    content: [
        [{
            alias: 'text',
            value: 'Declarar función'
        }, {
            id: 'FUNCNAME',
            alias: 'varInput',
            value: ''
        }, {
            alias: 'text',
            value: 'contando con'
        }, {
            bloqInputId: 'ARGS',
            alias: 'bloqInput',
            acceptType: 'var'
        }, {
            alias: 'text',
            value: 'devuelve'
        }, {
            bloqInputId: 'RETURN',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    createDynamicContent: 'returnFunctions',
    code: '{RETURN.connectionType} function {FUNCNAME} ({ARGS}) {{STATEMENTS}return {RETURN};}'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;