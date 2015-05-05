/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'InvokeFunction',
    content: [
        [{
            alias: 'text',
            value: 'Ejecutar'
        }, {
            id: 'FUNCTION',
            alias: 'dropdown',
            options: 'VoidFunctions'
        }]
    ],
    code: '{FUNCTION}({FUNCTION.args});'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;