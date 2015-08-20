/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'invokeClassReturnFunctionWithArguments',
    bloqClass: 'bloq-invoke-class-return-function',
    content: [
        [{
            alias: 'text',
            value: 'bloq-invoke-class-return-function-args-exec'
        }, {
            id: 'FUNCTION',
            alias: 'dynamicDropdown',
            options: 'returnFunctions'
        }, {
            alias: 'text',
            value: 'bloq-invoke-class-return-function-args-class'
        },  {
            id: 'CLASS',
            alias: 'dynamicDropdown',
            options: 'objects'
        }, {
            alias: 'text',
            value: 'bloq-invoke-class-return-function-args-args'
        }, {
            bloqInputId: 'ARGS',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{CLASS}.{FUNCTION}({ARGS});',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'FUNCTION',
        options: 'returnFunctions'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;