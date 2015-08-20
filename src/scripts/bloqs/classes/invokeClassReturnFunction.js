/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'invokeClassReturnFunction',
    bloqClass: 'bloq-invoke-class-return-function',
    content: [
        [{
            alias: 'text',
            value: 'bloq-invoke-class-return-function-exec'
        }, {
            id: 'FUNCTION',
            alias: 'dynamicDropdown',
            options: 'returnFunctions'
        }, {
            alias: 'text',
            value: 'bloq-invoke-class-function-class'
        },  {
            id: 'CLASS',
            alias: 'dynamicDropdown',
            options: 'objects'
        }]
    ],

    code: '{CLASS}.{FUNCTION}()',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'FUNCTION',
        options: 'returnFunctions'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;