/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    StatementInputBloq = require('./../../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'forAdvanced',
    bloqClass: 'bloq-for',
    content: [
        [{
            alias: 'text',
            value: 'bloq-for-count'
        }, {
            bloqInputId: 'VAR',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-for-from'
        }, {
            bloqInputId: 'INIT',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-for-to'
        }, {
            bloqInputId: 'FINAL',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            id: 'MODE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-for-add',
                value: '++'
            }, {
                label: 'bloq-for-subtract',
                value: '--'
            }]
        }, {
            alias: 'text',
            value: 'bloq-for-exec'
        }]
    ],
    code: 'for({VAR}={INIT};{VAR}<{FINAL};{VAR}{MODE}){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;