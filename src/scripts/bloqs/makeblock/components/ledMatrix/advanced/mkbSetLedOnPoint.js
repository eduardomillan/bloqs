/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../../build-utils'),
    StatementBloq = require('./../../../../statementBloq');

/**
 * Bloq name: 
 *
 * Bloq type: Statement
 *
 * Description:
 * Return type: none
 */

var mkbSetLedOnPoint = _.merge(_.clone(StatementBloq, true), {

    name: 'mkbSetLedOnPoint',
    bloqClass: 'bloq-mbot-color',
    content: [
        [{
            id: 'GESTURE',
            alias: 'staticDropdown',
            options: [{
                label: 'encender',
                value: '1'
            }, {
                label: 'apagar',
                value: '0'
            }]
        }, {
            alias: 'text',
            value: 'el led en la fila'
        }, {
            id: 'ROW',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: 'y la columna'
        }, {
            id: 'COLUMN',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: 'in-the'
        }, {
            id: 'LEDMATRIX',
            alias: 'dynamicDropdown',
            options: 'ledMatrix'
        }]
    ],
    code: '',
    arduino: {
        code: '{LEDMATRIX}.draw({GESTURE});'
    }
});
utils.preprocessBloq(mkbSetLedOnPoint);

module.exports = mkbSetLedOnPoint;
