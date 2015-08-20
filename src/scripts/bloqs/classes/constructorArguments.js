/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'constructorClassArguments',
    bloqClass: 'bloq-constructor-arguments',
    content: [
        [{
            alias: 'text',
            value: 'bloq-constructor-arguments'
        }, {
            bloqInputId: 'ARGS',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{CLASS-OUTSIDE} ({ARGS}){{STATEMENTS}};',
    hCode: '{CLASS-OUTSIDE} ({ARGS});',
    cppCode: '{CLASS-OUTSIDE} :: {CLASS-OUTSIDE} ({ARGS}){{STATEMENTS}};'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;