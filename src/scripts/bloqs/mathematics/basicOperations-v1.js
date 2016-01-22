/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: basicOperations-v1
 *
 * Bloq type: Output
 *
 * Description: It returns the result of the math operation between two given numbers.
 *
 * Return type: float
 */

var basicOperationsV1 = _.merge(_.clone(OutputBloq, true), {

    name: 'basicOperations-v1',
    bloqClass: 'bloq-basic-operations-v1',
    content: [
        [{
            bloqInputId: 'ARG1',
            alias: 'bloqInput',
            acceptType: 'all'
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
                    label: '÷',
                    value: '/'
                }] //'+', '-', '×', '÷']
        }, {
            bloqInputId: 'ARG2',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '({ARG1} {OPERATOR} {ARG2})',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(basicOperationsV1);


module.exports = basicOperationsV1;