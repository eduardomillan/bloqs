/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    OutputBloq = require('./../../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'stringArrayAdvanced',
    bloqClass: 'bloq-stringArray-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-stringArray-advanced-arraySize'
        }, {
            bloqInputId: 'VALUE',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-stringArray-advanced-type'
        }, {
            id: 'TYPE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-stringArray-advanced-string',
                value: 'String *'
            }, {
                label: 'bloq-stringArray-advanced-char',
                value: 'char *'
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