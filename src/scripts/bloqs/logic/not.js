/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'not',
    bloqClass: 'bloq-not',
    content: [
        [{
            alias: 'text',
            value: 'bloq-not-not'
        }, {
            bloqInputId: 'CONDITION',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '!{CONDITION}',
    returnType: {
        type: 'simple',
        value: 'bool'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;