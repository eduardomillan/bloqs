/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'invokeClassFunction',
    bloqClass: 'bloq-invoke-class-function',
    content: [
        [{
            alias: 'text',
            value: 'bloq-invoke-class-function-exec'
        }, {
            id: 'FUNCTION',
            alias: 'dynamicDropdown',
            options: 'voidFunctions'
        }, {
            alias: 'text',
            value: 'bloq-invoke-class-function-class'
        },  {
            id: 'CLASS',
            alias: 'dynamicDropdown',
            options: 'objects'
        }]
    ],
    code: '{CLASS}.{FUNCTION}();',
    dynamicDropdown : {
        idDropdown: 'FUNCTION',
        options: 'voidFunctions'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;
