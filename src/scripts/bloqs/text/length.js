/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'length',
    bloqClass: 'bloq-length',
    content: [
        [{
            alias: 'text',
            value: 'longitud'
        }, {
            bloqInputId: 'TEXT',
            alias: 'bloqInput',
            acceptType: 'string'
        }]
    ],
    code: '{TEXT}.length()',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;