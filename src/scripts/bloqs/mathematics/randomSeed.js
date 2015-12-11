/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'randomSeed',
    bloqClass: 'bloq-random-seed',
    content: [
        [{
            alias: 'text',
            value: 'bloq-random-seed'
        }]
    ],
    code: 'randomSeed(micros());',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;