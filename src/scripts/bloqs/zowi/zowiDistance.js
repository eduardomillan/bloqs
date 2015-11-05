/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'zowiDistance',
    bloqClass: 'bloq-zowi-distance',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-distance'
        }]
    ],
    code: 'zowi.getDistance()',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});
utils.generateBloqInputConnectors(bloq);

module.exports = bloq;