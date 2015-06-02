/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'setArrayVariable',
    bloqClass: 'bloq-set-variable',
    content: [
        [{
            alias: 'text',
            value: 'Variable'
        }, {
            id: 'NAME',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }, {
            alias: 'text',
            value: '['
        }, {
            id: 'ITERATOR',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: ']'
        },{
            alias: 'text',
            value: '='
        }, {
            bloqInputId: 'VALUE',
            alias: 'bloqInput',
            acceptType: {
                type: 'fromDynamicDropdown',
                idDropdown: 'NAME',
                pointer: 'true',
                options: 'softwareVars'
            }
        }]
    ],
    code: '{NAME}[{ITERATOR}] = {VALUE};'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;