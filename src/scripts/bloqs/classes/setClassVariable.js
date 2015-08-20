/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'setClassVariable',
    bloqClass: 'bloq-set-class-variable',
    content: [
        [{
            alias: 'text',
            value: 'bloq-set-class-variable-variable'
        }, {
            id: 'NAME',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }, {
            alias: 'text',
            value: 'bloq-invoke-class-function-class'
        },  {
            id: 'CLASS',
            alias: 'dynamicDropdown',
            options: 'objects'
        }, {
            alias: 'text',
            value: '='
        }, {
            bloqInputId: 'VALUE',
            alias: 'bloqInput',
            acceptType: {
                type: 'fromDynamicDropdown',
                idDropdown: 'NAME',
                options: 'softwareVars'
            }
        }]
    ],
    code: '{CLASS}.{NAME} = {VALUE};'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;