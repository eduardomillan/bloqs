/*global require */
'use strict';

var _ = require('lodash');
var StatementBloq = require('./../../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'lcdTurnOnOffAdvanced',
    content: [
        [{
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'Encender la luz del LCD'
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