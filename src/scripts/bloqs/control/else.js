/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'else',
    content: [
        [{
            alias: 'text',
            value: 'de lo contrario, ejecutar:'
        }]
    ],
    code: 'else {{STATEMENTS}}'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;