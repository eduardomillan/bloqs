/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'zowiHome',
    bloqClass: 'bloq-zowi-rest',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-rest'
        }]
    ],
    code: 'zowi.home();'
});
utils.generateBloqInputConnectors(bloq);

module.exports = bloq;