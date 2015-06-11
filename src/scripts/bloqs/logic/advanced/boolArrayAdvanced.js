/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    OutputBloq = require('./../../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'boolArrayAdvanced',
    bloqClass: 'bloq-boolArray-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-boolArray-advanced-arraySize'
        }, {
            bloqInputId: 'VALUE',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-boolArray-advanced-boolType'
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