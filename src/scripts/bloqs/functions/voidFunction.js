/*global require */
'use strict';

var _ = require('lodash');
var StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'VoidFunction',
    content: [
        [{
            alias: 'text',
            value: 'Declarar función'
        }, {
            alias: 'stringInput',
            value: 'nombreFuncion'
        }]
    ],
    code: {
        setup: ['{0}'],
        loop: ['{0}']
    }
});

module.exports = bloq;