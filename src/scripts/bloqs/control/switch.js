/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'switch',
    bloqClass: 'bloq-switch',
    content: [
        [{
            alias: 'text',
            value: 'bloq-switch-check'
        }, {
            id: 'VAR',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }]
    ],
    code: 'switch (int({VAR})) {{STATEMENTS}}'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;