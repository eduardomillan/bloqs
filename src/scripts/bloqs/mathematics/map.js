/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'map',
    bloqClass: 'bloq-map',
    content: [
        [{
            alias: 'text',
            value: 'Mapear'
        }, {
            bloqInputId: 'VAR',
            alias: 'bloqInput',
            acceptType: 'float'
        }, {
            alias: 'text',
            value: 'valor entre [0-'
        }, {
            bloqInputId: 'MAXVAL',
            alias: 'bloqInput',
            acceptType: 'float'
        }, {
            alias: 'text',
            value: ']'
        }]
    ],
    code: 'map({VAR},0,1023,0,{MAXVAL})',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;