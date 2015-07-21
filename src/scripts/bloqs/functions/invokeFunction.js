/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'invokeFunction',
    bloqClass: 'bloq-invoke-function',
    content: [
        [{
            alias: 'text',
            value: 'bloq-invoke-function-exec'
        }, {
            id: 'FUNCTION',
            alias: 'dynamicDropdown',
            options: 'voidFunctions'
        }]
    ],
    code: '{FUNCTION}({FUNCTION.args});'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;
