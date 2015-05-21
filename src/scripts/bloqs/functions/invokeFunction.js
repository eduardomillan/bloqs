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
            value: 'Ejecutar'
        }, {
            id: 'FUNCTION',
            alias: 'dynamicDropdown',
            options: 'voidFunctions'
        }]
    ],
    code: '{FUNCTION}({FUNCTION.args});',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'FUNCTION',
        options: 'voidFunctions'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;