/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'boolean',
    bloqClass: 'bloq-boolean',
    content: [
        [{
            id: 'STATE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-boolean-true',
                value: 'true'
            }, {
                label: 'bloq-boolean-false',
                value: 'false'
            }]
        }]
    ],
    code: '{STATE}',
    returnType: {
        type: 'simple',
        value: 'bool'
    }

});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;