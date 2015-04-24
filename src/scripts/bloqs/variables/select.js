/*global require */
'use strict';

var _ = require('lodash');
var OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'SelectVariable',
    content: [
        [{
            alias: 'text',
            value: 'Variable'
        }, {
            alias: 'dropdown',
            options: ['Seleccionar']
        }]
    ]
});

module.exports = bloq;