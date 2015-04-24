/*global require */
'use strict';

var _ = require('lodash');
var OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'map',
    content: [
        [{
            alias: 'text',
            value: 'Mapear'
        }, {
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'valor entre [0-'
        }, {
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: ']'
        }]
    ],
    code: {
        setup: ['{0}'],
        loop: ['{0}']
    }
});

module.exports = bloq;