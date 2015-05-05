/*global require */
'use strict';

var _ = require('lodash');
var OutputBloq = require('./../../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'variablesComponents',
    content: [
        [{
            alias: 'text',
            value: 'Variable (componentes)'
        }, {
            id: 'VALUE',
            alias: 'dropdown',
            options: 'varComponents'
        }]
    ],
    code: '{VALUE}'
});

module.exports = bloq;