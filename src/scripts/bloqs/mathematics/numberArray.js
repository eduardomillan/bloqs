/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'numberArray',
    bloqClass: 'bloq-number',
    content: [
        [{
            alias: 'text',
            value: 'array con tamaño'
        }, {
            id: 'VALUE',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: 'y tipo float'
        }]
    ],
    code:  '(float*)malloc({VALUE}*sizeof(float))',
    returnType: {
        type: 'simple',
        value: 'float *'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;