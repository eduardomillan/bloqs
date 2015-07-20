/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'lcdClear',
    bloqClass: 'bloq-lcd-clear',
    content: [
        [{
            alias: 'text',
            value: 'bloq-lcd-clear'
        }, {
            id: 'LCD',
            alias: 'dynamicDropdown',
            options: 'lcds'
        }]
    ],
    code: '{LCD}.clear();'

});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;