/*global require */
'use strict';

var _ = require('lodash');
var StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'print',
    content: [
        [{
            alias: 'text',
            value: 'Imprimir por puerto serie'
        }, {
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: {
        setup: ['{0}'],
        loop: ['{0}']
    }
});

module.exports = bloq;