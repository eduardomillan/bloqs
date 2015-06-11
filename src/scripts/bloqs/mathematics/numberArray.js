/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'numberArray',
    bloqClass: 'bloq-numberArray',
    content: [
        [{
            alias: 'text',
            value: 'bloq-numberArray-arraySize'
        }, {
            id: 'VALUE',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: 'bloq-numberArray-floatType'
        }]
    ],
    code: '(float*)malloc({VALUE}*sizeof(float))',
    returnType: {
        type: 'simple',
        value: 'float *'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;