/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    StatementBloq = require('./../../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'invokeFunctionWithArguments',
    bloqClass: 'bloq-invoke-function',
    content: [
        [{
            alias: 'text',
            value: 'bloq-invoke-function-exec'
        }, {
            id: 'FUNCTION',
            alias: 'dynamicDropdown',
            options: 'voidFunctions'
        }, {
            alias: 'text',
            value: 'bloq-invoke-function-args'
        }, {
            bloqInputId: 'ARGS',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{FUNCTION}({ARGS});',
    dynamicDropdown : {
        idDropdown: 'FUNCTION',
        options: 'voidFunctions'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;


