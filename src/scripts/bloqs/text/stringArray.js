/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'stringArray',
    bloqClass: 'bloq-stringArray',
    content: [
        [{
            alias: 'text',
            value: 'bloq-stringArray-arraySize'
        }, {
            id: 'VALUE',
            alias: 'numberInput',
            value: 3
        }, {
            alias: 'text',
            value: 'bloq-stringArray-stringType'
        }]
    ],
    code: '(String *)malloc({VALUE}*sizeof(String))',
    returnType: {
        type: 'simple',
        value: 'String *'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;