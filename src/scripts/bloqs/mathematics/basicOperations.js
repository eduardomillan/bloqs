/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

/**
* Bloq name: basicOperations
*
* Bloq type: Output
*
* Description: It returns the result of the math operation between two given numbers.
*
* Return type: float
*/

var basicOperations = _.merge(_.clone(OutputBloq, true), {

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
                    label: '÷',
                    value: '/'
                }] //'+', '-', '×', '÷']
        }, {
            bloqInputId: 'ARG2',
            alias: 'bloqInput',
            acceptType: 'float'
        }]
    ],
    code: '({ARG1} {OPERATOR} {ARG2})',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(basicOperations);


module.exports = basicOperations;
