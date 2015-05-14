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
            acceptType: 'all'
        }]
    ],
    code: '{TEXT}.length()',
    returnType: 'float'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;