/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'invokeReturnFunction',
    bloqClass: 'bloq-invoke-return-function',
    content: [
        [{
            alias: 'text',
            value: 'ejecutar'
        }, {
            id: 'FUNCTION',
            alias: 'dynamicDropdown',
            options: 'returnFunctions'
        }]
    ],
    code: '{FUNCTION}({FUNCTION.args});',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'FUNCTION',
        options: 'returnFunctions'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;