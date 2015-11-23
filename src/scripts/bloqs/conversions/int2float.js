/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'int2float-v1',
    bloqClass: 'bloq-int-2-float',
    content: [
        [{
            alias: 'text',
            value: 'convertir int a float: '
        }, {
            bloqInputId: 'NUMBER',
            alias: 'bloqInput',
            acceptType: 'int'
        }]
    ],
    code: '(float) {NUMBER}',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;