/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'stringArray',
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
            value: 'y tipo string'
        }]
    ],
    code:  '(String *)malloc({VALUE}*sizeof(String))',
    returnType: {
        type: 'simple',
        value: 'String *'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;