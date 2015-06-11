/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {
    name: 'declareVariable',
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
    code: '{VALUE.connectionType} {NAME} = {VALUE};'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;