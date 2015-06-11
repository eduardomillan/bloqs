/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    OutputBloq = require('./../../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'numberArrayAdvanced',
    bloqClass: 'bloq-numberArray-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-numberArray-advanced-arraySize'
        }, {
            bloqInputId: 'VALUE',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-numberArray-advanced-type'
        }, {
            id: 'TYPE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-numberArray-advanced-float',
                value: 'float *'
            }, {
                label: 'bloq-numberArray-advanced-int',
                value: 'int *'
            }]
        }]
    ],
    code: '({TYPE})malloc({VALUE}*sizeof({TYPE}.withoutAsterisk))',
    returnType: {
        type: 'fromDropdown',
        idDropdown: 'TYPE',
        options: 'softwareVars'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;