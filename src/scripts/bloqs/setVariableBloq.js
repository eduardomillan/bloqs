/*global require */
'use strict';

var _ = require('lodash');
var StatementBloq = require('./statementBloq');

var bloq = _.merge(Object.create(StatementBloq), {
    name: 'setVariable',
    content: [
        [{
            alias: 'stringInput',
            placeholder: 'Introduce el nombre de la variable'
        }, {
            alias: 'text',
            value: '='
        }, {
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ]
});

module.exports = bloq;