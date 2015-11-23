/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'basicOperations',
    bloqClass: 'bloq-basic-operations',
    content: [
        [{
            bloqInputId: 'ARG1',
            alias: 'bloqInput',
            acceptType: 'float'
        }, {
            id: 'OPERATOR',
            alias: 'staticDropdown',
            options: [{
                    label: '+',
                    value: '+'
                }, {
                    label: '-',
                    value: '-'
                }, {
                    label: 'x',
                    value: '*'
                }, {
                    label: '/',
                    value: '/'
                }, {
                    label: '^',
                    value: '^'
                }, {
                    label: '%',
                    value: '%'
                }] //'+', '-', '×', '÷', '^']
        }, {
            bloqInputId: 'ARG2',
            alias: 'bloqInput',
            acceptType: 'float'
        }]
    ],
    code: '\'{OPERATOR}\' === \'^\'? \'pow({ARG1},{ARG2})\' : \'({ARG1} {OPERATOR} {ARG2})\'',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(bloq);


module.exports = bloq;