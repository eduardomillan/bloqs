/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    OutputBloq = require('./../../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'char',
    bloqClass: 'bloq-string',
    content: [
        [{
            alias: 'text',
            value: '\''
        }, {
            id: 'TEXT',
            alias: 'charInput',
            placeholder: 'bloq-char'
        }, {
            alias: 'text',
            value: '\''
        }]
    ],
    code: '\'{TEXT}\'',
    returnType: {
        type: 'simple',
        value: 'char'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;
