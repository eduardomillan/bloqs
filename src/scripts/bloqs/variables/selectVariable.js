/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'selectVariable',
    bloqClass: 'bloq-select-variable',
    content: [
        [{
            alias: 'text',
            value: 'bloq-select-variable-variable'
        }, {
            id: 'VAR',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }]
    ],
    code: '{VAR}',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'VAR',
        options: 'softwareVars'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;