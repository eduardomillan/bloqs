/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'caseDefault',
    bloqClass: 'bloq-case-default',
    content: [
        [{
            alias: 'text',
            value: 'bloq-case-default-inOtherCase'
        }]
    ],
    code: 'default:{{STATEMENTS}break;}'

});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;