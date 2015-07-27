/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    OutputBloq = require('./../../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'arrayVariableAdvanced',
    bloqClass: 'bloq-array-variable',
    content: [
        [{
            alias: 'text',
            value: 'bloq-array-variable-variable'
        }, {
            id: 'VAR',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }, {
            alias: 'text',
            value: '['
        }, {
            bloqInputId: 'POSITION',
            alias: 'bloqInput',
            acceptType : 'all'
        }, {
            alias: 'text',
            value: ']'
        }]
    ],
    code: '{VAR}[{POSITION}]',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'VAR',
        pointer: 'true',
        options: 'softwareVars'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;