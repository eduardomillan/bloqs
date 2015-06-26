/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'equalityOperations',
    bloqClass: 'bloq-equality-operations',
    content: [
        [{
            bloqInputId: 'ARG1',
            alias: 'bloqInput',
            acceptType: 'all'
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
            acceptType: 'all'
        }]
    ],
    code: '{ARG1} {OPERATOR} {ARG2}',
    returnType: {
        type: 'simple',
        value: 'bool'
    }

});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;