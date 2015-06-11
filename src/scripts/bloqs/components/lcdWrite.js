/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'lcdWrite',
    bloqClass: 'bloq-lcd-writte',
    content: [
        [{
            alias: 'text',
            value: 'bloq-lcd-writte-write'
        }, {
            id: 'TEXT',
            alias: 'stringInput',
            value: ''
        }, {
            alias: 'text',
            value: 'bloq-lcd-writte-inLCD'
        }, {
            id: 'LCD',
            alias: 'dynamicDropdown',
            options: 'lcds'
        }]
    ],
    code: '{LCD}.print({TEXT});'

});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;