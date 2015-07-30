/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    StatementInputBloq = require('./../../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'returnFunctionWithArguments',
    bloqClass: 'bloq-return-function-with-arguments',
    content: [
        [{
            alias: 'text',
            value: 'bloq-return-function-with-arguments-declare'
        }, {
            id: 'FUNCNAME',
            alias: 'varInput',
            placeholder:'bloq-functions-default'
        }, {
            alias: 'text',
            value: 'bloq-return-function-with-arguments-count'
        }, {
            bloqInputId: 'ARGS',
            alias: 'bloqInput',
            acceptType: 'var'
        }, {
            position: 'DOWN',
            alias: 'text',
            value: 'bloq-return-function-with-arguments-return'
        }, {
            position: 'DOWN',
            bloqInputId: 'RETURN',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    createDynamicContent: 'returnFunctions',
    returnType: {
        type: 'fromInput',
        bloqInputId: 'RETURN'
    },
    arguments: {
        type: 'fromInput',
        bloqInputId: 'ARGS'
    },
    code: '{RETURN.connectionType} {FUNCNAME} ({ARGS}) {{STATEMENTS}return {RETURN};}'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;