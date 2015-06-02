/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    OutputBloq = require('./../../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'boolArrayAdvanced',
    bloqClass: 'bloq-number',
    content: [
        [{
            alias: 'text',
            value: 'array con tamaño'
        }, {
            bloqInputId: 'VALUE',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'y tipo bool'
        }]
    ],
    code:  '(bool *)malloc({VALUE}*sizeof(bool))',
    returnType: {
        type: 'simple',
        value: 'bool *'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;