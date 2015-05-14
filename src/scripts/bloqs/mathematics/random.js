/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'random',
    bloqClass: 'bloq-random',
    content: [
        [{
            alias: 'text',
            value: 'Aleatorio entre'
        }, {
            bloqInputId: 'ARG1',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'y'
        }, {
            bloqInputId: 'ARG2',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: 'random({ARG1},{ARG2}+1)'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;