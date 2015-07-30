/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'voidFunction',
    bloqClass: 'bloq-void-function',
    content: [
        [{
            alias: 'text',
            value: 'bloq-void-function-declare'
        }, {
            id: 'FUNCNAME',
            alias: 'varInput',
            placeholder:'bloq-functions-default'
        }]
    ],
    createDynamicContent: 'voidFunctions',
    returnType: {
        type: 'simple',
        value: 'void'
    },
    code: 'void {FUNCNAME} (){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;