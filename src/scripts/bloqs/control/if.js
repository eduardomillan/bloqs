/*global require */
'use strict';

var _ = require('lodash');
var StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'if',
    content: [
        [{
            alias: 'text',
            value: 'Si'
        }, {
            alias: 'bloqInput',
            acceptType: 'all',
            name: 'firstParameter'
        }, {
            alias: 'text',
            value: 'ejecutar:'
        }]
    ],
    code: {
        setup: ['{0}'],
        loop: ['{0}']
    }
});

bloq.connectors.push({
    type: 'connector--input',
    accept: 'connector--output',
    name: 'firstParameter'

});

module.exports = bloq;