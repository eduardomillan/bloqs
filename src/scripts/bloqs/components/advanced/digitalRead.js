/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    OutputBloq = require('./../../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'digitalReadAdvanced',
    bloqClass: 'bloq-digital-read-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-digital-read-advanced-readpin'
        }, {
            bloqInputId: 'PIN',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: 'digitalRead({PIN})',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;