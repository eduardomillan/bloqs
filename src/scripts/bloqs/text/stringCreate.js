/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'stringCreate',
    bloqClass: 'bloq-string-create',
    content: [
        [{
            alias: 'text',
            value: 'crear texto con'
        }, {
            bloqInputId: 'TEXT',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: 'String({TEXT})',
    returnType: 'String'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;