/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'oscillator',
    bloqClass: 'bloq-oscillator',
    content: [
        [{
            alias: 'text',
            value: 'Oscilar servo'
        }, {
            id: 'OSCILLATOR',
            alias: 'dynamicDropdown',
            options: 'oscillators'
        }, {
            alias: 'text',
            value: 'alrededor de'
        }, {
            id: 'PHASE',
            alias: 'numberInput',
            value: 0,
        }, {
            alias: 'text',
            value: 'con amplitud'
        }, {
            id: 'AMPLITUDE',
            alias: 'numberInput',
            value: 0,
        }, {
            alias: 'text',
            value: 'con velocidad'
        }, {
            id: 'SPEED',
            alias: 'numberInput',
            value: 0,
        }]
    ],
    code: '{OSCILLATOR}.SetO({PHASE});{OSCILLATOR}.SetA({AMPLITUDE});{OSCILLATOR}.SetT({SPEED});{OSCILLATOR}.refresh();'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;