/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'zowiSound',
    bloqClass: 'bloq-zowi-sound',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-sound'
        }]
    ],
    code: 'zowi.getNoise()',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});
utils.generateBloqInputConnectors(bloq);

module.exports = bloq;