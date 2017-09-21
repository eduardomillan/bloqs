/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: substring
 *
 * Bloq type: Output
 *
 * Description: 
 *
 * Return type: 
 */

var substring = _.merge(_.clone(OutputBloq, true), {

    name: 'substring',
    bloqClass: 'bloq-string',
    content: [
        [{
            alias: 'text',
            value: 'Extraer texto de'
        }, {
            id: 'STRING',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }, {
            alias: 'text',
            value: 'empezando en la posición'
        },
        {
            id: 'FROM',
            alias: 'numberInput',
            value: 0
        },
        {
            alias: 'text',
            value: 'y acabando en la posición'
        },
        {
            id: 'TO',
            alias: 'numberInput',
            value: 3
        }]
    ],
    returnType: {
        type: 'simple',
        value: 'String'
    },
    arduino: {
        code: '{STRING}.substring({FROM}, {TO})'
    }
});

utils.preprocessBloq(substring);

module.exports = substring;