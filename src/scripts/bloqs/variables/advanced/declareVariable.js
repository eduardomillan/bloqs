/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    StatementBloq = require('./../../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {
    name: 'declareVariableAdvanced',
    bloqClass: 'bloq-declare-variable',
    content: [
        [{
            alias: 'text',
            value: 'bloq-declare-variable-declare'
        }, {
            id: 'NAME',
            alias: 'varInput',
            value: ''
        }, {
            alias: 'text',
            value: 'bloq-declare-variable-declare-type'
        }, {
            id: 'TYPE',
            alias: 'staticDropdown',
            options: [{
                    label: 'bloq-declare-variable-declare-type-int',
                    value: 'int'
                }, {
                    label: 'bloq-declare-variable-declare-type-float',
                    value: 'float'
                }, {
                    label: 'bloq-declare-variable-declare-type-text',
                    value: 'String'
                }, {
                    label: 'bloq-declare-variable-declare-type-char',
                    value: 'char'
                }, {
                    label: 'bloq-declare-variable-declare-type-bool',
                    value: 'bool'
                }] //'+', '-', '×', '÷', '^']
        }, {
            alias: 'text',
            value: '='
        }, {
            bloqInputId: 'VALUE',
            alias: 'bloqInput',
            acceptType: 'all',
        }]
    ],
    returnType: {
        type: 'fromInput',
        bloqInputId: 'VALUE'
    },
    createDynamicContent: 'softwareVars',
    code: '{TYPE} {NAME} = {VALUE};'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;