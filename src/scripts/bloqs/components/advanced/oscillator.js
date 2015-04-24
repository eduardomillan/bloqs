/*global require */
'use strict';

var _ = require('lodash');
var StatementBloq = require('./../../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'oscillatorAdvanced',
    content: [
        [{
            alias: 'text',
            value: 'Oscilar servo'
        }, {
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'alrededor de'
        }, {
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'con amplitud'
        }, {
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'con velocidad'
        }, {
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: {
        setup: ['{0}'],
        loop: ['{0}']
    }
});

module.exports = bloq;