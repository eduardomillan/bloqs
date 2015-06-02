/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    OutputBloq = require('./../../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'numberArrayAdvanced',
    bloqClass: 'bloq-number',
    content: [
        [{
            alias: 'text',
            value: 'array con tamaño'
        }, {
            bloqInputId: 'VALUE',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'y tipo'
        },{
            id: 'TYPE',
            alias: 'staticDropdown',
            options: [{
                label: 'float',
                value: 'float *'
            }, {
                label: 'int',
                value: 'int *'
            }]
        }]
    ],
    code:  '({TYPE})malloc({VALUE}*sizeof({TYPE}.withoutAsterisk))',
    returnType: {
        type: 'fromDropdown',
        idDropdown: 'TYPE',
        options: 'softwareVars'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;