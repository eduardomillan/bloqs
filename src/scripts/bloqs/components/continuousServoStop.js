/*global require */
'use strict';

var _ = require('lodash');
var StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'continuousServoStop',
    content: [
        [{
            alias: 'text',
            value: 'Parar servo'
        }, {
            alias: 'dropdown',
            options: ['Seleccionar']
        }]
    ],
    code: {
        setup: ['{0}'],
        loop: ['{0}']
    }
});

module.exports = bloq;