/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'string',
    bloqClass: 'bloq-string',
    content: [
        [{
            alias: 'text',
            value: '"'
        }, {
            id: 'TEXT',
            alias: 'stringInput',
            placeholder: 'bloq-string-string'
        }, {
            alias: 'text',
            value: '"'
        }]
    ],
    code: '{TEXT}',
    returnType: {
        type: 'simple',
        value: 'String'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;
