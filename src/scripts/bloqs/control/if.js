/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
 * Bloq name: if
 *
 * Bloq type: Statement-Input
 *
 * Description: It executes the following code only if the condition
 *              is met.
 *
 * Return type: none
 */

var bloqIf = _.merge(_.clone(StatementInputBloq, true), {

    name: 'if',
    bloqClass: 'bloq-if',
    content: [
        [{
            alias: 'text',
            value: 'bloq-if-if'
        }, {
            bloqInputId: 'ARG1',
            alias: 'bloqInput',
            acceptType: ['all']
        }, {
            id: 'OPERATOR',
            alias: 'staticDropdown',
            options: [{
                    label: '=',
                    value: '=='
                }, {
                    label: '!=',
                    value: '!='
                }, {
                    label: '>',
                    value: '>'
                }, {
                    label: '>=',
                    value: '>='
                }, {
                    label: '<',
                    value: '<'
                }, {
                    label: '<=',
                    value: '<='
                }] //'=', '≠', '>', '≥', '<', '≤']
        }, {
            bloqInputId: 'ARG2',
            alias: 'bloqInput',
            acceptType: ['all']
        }, {
            alias: 'text',
            value: 'bloq-if-exec'
        }, ]
    ],
    code: 'if({ARG1} {OPERATOR} {ARG2}){{STATEMENTS}}',
    python: {
        codeLines: [{
            code: 'if({ARG1} {OPERATOR} {ARG2}):'
        }, {
            indentation: 1,
            code: '{STATEMENTS}'
        }]
    }
});

utils.generateBloqInputConnectors(bloqIf);
bloqIf.connectors[1].acceptedAliases = ['all', 'ifDown'];

bloqIf.connectors[1].suggestedBloqs = ['else', 'elseif'];

bloqIf.connectors[3].suggestedBloqs = ['number', 'string'];

module.exports = bloqIf;
