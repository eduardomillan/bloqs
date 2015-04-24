/*global require */
'use strict';

var _ = require('lodash');
var StatementBloq = require('./../../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'servoAdvanced',
    content: [
        [{
            alias: 'text',
            value: 'Mover'
        }, {
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'de'
        }, {
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'a'
        }, {
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'grados'
        }]
    ],
    code: {
        setup: ['{0}'],
        loop: ['{0}']
    }
});

module.exports = bloq;