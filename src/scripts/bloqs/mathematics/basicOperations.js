/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'basicOperations',
    content: [
        [{
            alias: 'bloqInput',
            name: 'firstParameter',
            acceptType: 'all'
        }, {
            alias: 'dropdown',
            options: ['+', '-', '×', '÷', '^']
        }, {
            alias: 'bloqInput',
            name: 'secondParameter',
            acceptType: 'all'
        }]
    ],
    code: {
        setup: ['{0}'],
        loop: ['{0}']
    }
});

utils.generateBloqInputConnectors(bloq);


module.exports = bloq;