/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'stringCreate',
    bloqClass: 'bloq-string-create',
    content: [
        [{
            alias: 'text',
            value: 'crear texto con'
        }, {
            bloqInputId: 'TEXT',
            alias: 'bloqInput',
            acceptType: 'string'
        }]
    ],
    code: 'String({TEXT})',
    returnType: {
        type: 'simple',
        value: 'string'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;