/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'wait',
    bloqClass: 'bloq-wait',
    content: [
        [{
            alias: 'text',
            value: 'bloq-wait-wait'
        }, {
            bloqInputId: 'TIME',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: 'delay({TIME});'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;