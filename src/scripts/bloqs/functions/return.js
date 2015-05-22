/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'return',
    bloqClass: 'bloq-return',
    content: [
        [{
            alias: 'text',
            value: 'devuelve'
        }, {
            bloqInputId: 'RETURN',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: 'return {RETURN};'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;