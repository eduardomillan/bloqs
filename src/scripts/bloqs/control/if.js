/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'if',
    content: [
        [{
            alias: 'text',
            value: 'Si'
        }, {
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'ejecutar:'
        }]
    ],
    code: {
        setup: ['{0}'],
        loop: ['{0}']
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;