/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'lcdWritePosition',
    bloqClass: 'bloq-lcd-writte',
    content: [
        [{
            alias: 'text',
            value: 'bloq-lcd-writte-write'
        }, {
            id: 'TEXT',
            alias: 'stringInput',
            placeholder: 'bloq-lcd-default'
        }, {
            alias: 'text',
            value: 'bloq-lcd-writte-inLCD'
        }, {
            id: 'LCD',
            alias: 'dynamicDropdown',
            options: 'lcds'
        }, {
            alias: 'text',
            value: 'bloq-lcd-writte-advanced-inPosition'
        }, {
            id: 'COLUMN',
            alias: 'numberInput',
            value: 0
        }, {
            id: 'ROW',
            alias: 'numberInput',
            value: 0
        }]
    ],
    code: '{LCD}.setCursor({COLUMN},{ROW});{LCD}.print({TEXT});'

});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;