/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'servo',
    bloqClass: 'bloq-servo',
    content: [
        [{
            alias: 'text',
            value: 'Mover'
        }, {
            id: 'SERVO',
            alias: 'dynamicDropdown',
            options: 'servos'
        }, {
            alias: 'text',
            value: 'a'
        }, {
            id: 'POSITION',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: 'grados'
        }]
    ],
    code: '{SERVO}.write({POSITION});'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;