/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    OutputBloq = require('./../../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'hwVariable',
    bloqClass: 'bloq-hw-variable-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-hw-variable-advanced-variable'
        }, {
            id: 'COMPONENT',
            alias: 'dynamicDropdown',
            options: 'varComponents'
        }]
    ],
    code: '{COMPONENT}',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'COMPONENT',
        options: 'varComponents'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;