/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'boolArray',
    bloqClass: 'bloq-boolArray',
    content: [
        [{
            alias: 'text',
            value: 'bloq-boolArray-arraySize'
        }, {
            id: 'VALUE',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: 'bloq-boolArray-boolType'
        }]
    ],
    code: '(bool *)malloc({VALUE}*sizeof(bool))',
    returnType: {
        type: 'simple',
        value: 'bool *'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;