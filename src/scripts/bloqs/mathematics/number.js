/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'number',
    content: [
        [{
            id: 'VALUE',
            alias: 'numberInput',
            value: 0
        }]
    ],
    code: '{VALUE}',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;