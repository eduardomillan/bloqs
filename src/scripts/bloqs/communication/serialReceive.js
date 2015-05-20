/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'serialReceive',
    bloqClass: 'bloq-serial-receiver',
    content: [
        [{
            id: 'SERIAL',
            alias: 'dynamicDropdown',
            options: 'serialElements'
        }, {
            alias: 'text',
            value: 'recibir'
        }]
    ],
    code: '{SERIAL}.read()',
    returnType: {
        type: 'simple',
        value: 'string'
    }
});
utils.generateBloqInputConnectors(bloq);

module.exports = bloq;