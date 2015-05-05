/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'map',
    content: [
        [{
            alias: 'text',
            value: 'Mapear'
        }, {
            bloqInputId: 'VAR',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'valor entre [0-'
        }, {
            bloqInputId: 'MAXVAL',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: ']'
        }]
    ],
    code: 'map({VAR},0,1023,0,{MAXVAL});'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;