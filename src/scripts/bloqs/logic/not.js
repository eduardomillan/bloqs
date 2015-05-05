/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'not',
    content: [
        [{
            alias: 'text',
            value: 'no'
        }, {
            bloqInputId: 'CONDITION',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '!{CONDITION}'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;