/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'voidFunctionWithArguments',
    bloqClass: 'bloq-void-function-with-arguments',
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
        }]
    ],
    createDynamicContent: 'voidFunctions',
    returnType: {
        type: 'simple',
        value: 'void'
    },
    arguments:{
        type: 'fromInput',
        bloqInputId: 'ARGS'
    },
    code: 'void {FUNCNAME} ({ARGS}){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;