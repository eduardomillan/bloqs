/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    StatementBloq = require('./../../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'setArrayVariableAdvanced',
    bloqClass: 'bloq-set-variableArray',
    content: [
        [{
            alias: 'text',
            value: 'bloq-set-variableArray-variable'
        }, {
            id: 'NAME',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }, {
            alias: 'text',
            value: '['
        }, {
            bloqInputId: 'ITERATOR',
            alias: 'bloqInput',
            acceptType : 'all'
        }, {
            alias: 'text',
            value: ']'
        }, {
            alias: 'text',
            value: '='
        }, {
            bloqInputId: 'VALUE',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{NAME}[{ITERATOR}] = {VALUE};'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;