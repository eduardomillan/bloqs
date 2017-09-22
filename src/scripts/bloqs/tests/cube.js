/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: wait
 *
 * Bloq type: Statement
 *
 * Description: It delays the progression of the program
 *              the given time.
 *
 * Return type: none
 */

var wait = _.merge(_.clone(StatementBloq, true), {

    name: 'cube',
    bloqClass: 'bloq-wait',
    content: [
        [{
            alias: 'text',
            value: 'Crear cubo con tamaño X:'
        }, {
            id: 'X',
            alias: 'numberInput',
            value: 10,
        }, {
            alias: 'text',
            value: 'Y:'
        }, {
            id: 'Y',
            alias: 'numberInput',
            value: 10,
        }, {
            alias: 'text',
            value: 'Z:'
        }, {
            id: 'Z',
            alias: 'numberInput',
            value: 10,
        }]
    ],
    arduino: {
        code: 'cube([{X}, {Y}, {Z}], center=false);'
    }
});

utils.preprocessBloq(wait);

module.exports = wait;