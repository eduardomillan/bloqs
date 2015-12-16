/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    OutputBloq = require('./../../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'argument',
    bloqClass: 'bloq-argument',
    content: [
        [{
            alias: 'text',
            value: 'bloq-argument-var'
        }, {
            id: 'TYPE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-argument-int',
                value: 'int'
            }, {
                label: 'bloq-argument-float',
                value: 'float'
            }, {
                label: 'bloq-argument-string',
                value: 'String'
            }, {
                label: 'bloq-argument-char',
                value: 'char'
            }, {
                label: 'bloq-argument-bool',
                value: 'bool'
            }]
        }, {
            id: 'VARNAME',
            alias: 'varInput',
            value: ''
        }]
    ],
    createDynamicContent: 'softwareVars',
    code: '{TYPE} {VARNAME}',
    returnType: {
        type: 'fromDropdown',
        idDropdown: 'TYPE',
        options: 'softwareVars'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;