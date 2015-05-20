/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'break',
    bloqClass: 'bloq-break',
    content: [
        [{
            alias: 'text',
            value: 'Interrumpir el bucle'
        }]
    ],
    code: 'break;'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;