/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'returnFunction',
    bloqClass: 'bloq-return-function',
    content: [
        [{
            alias: 'text',
            value: 'Declarar función'
        }, {
            id: 'FUNCNAME',
            alias: 'varInput',
            value: ''
        }, {
            position: 'DOWN',
            alias: 'text',
            value: 'devuelve'
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
    code: '{RETURN.connectionType} {FUNCNAME} () {{STATEMENTS}return {RETURN};}'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;