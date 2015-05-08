/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'for',
    content: [
        [{
            alias: 'text',
            value: 'Contar con'
        }, {
            bloqInputId: 'VAR',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'desde'
        }, {
            bloqInputId: 'INIT',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'hasta'
        }, {
            bloqInputId: 'FINAL',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            id: 'MODE',
            alias: 'staticDropdown',
            options: [{
                label: 'sumando',
                value: '++'
            }, {
                label: 'restando',
                value: '--'
            }]
        }, {
            alias: 'text',
            value: 'ejecutar:'
        }]
    ],
    code: 'for({VAR}={INIT};{VAR}<{FINAL};{VAR}{MODE}){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;