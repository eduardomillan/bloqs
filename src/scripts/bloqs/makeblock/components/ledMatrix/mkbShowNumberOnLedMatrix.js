/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../build-utils'),
    StatementBloq = require('./../../../statementBloq');

/**
 * Bloq name: show time on led matrix
 *
 * Bloq type: Statement
 *
 * Description:
 *
 */

var mBotShowNumberOnLedMatrix = _.merge(_.clone(StatementBloq, true), {

    name: 'mBotShowNumberOnLedMatrix',
    bloqClass: 'bloq-mbot-color',
    content: [
        [{
            alias: 'text',
            value: 'Mostrar el número'
        }, {
            id: 'NUMBER',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: 'en la'
        }, {
            id: 'LEDMATRIX',
            alias: 'dynamicDropdown',
            options: 'ledMatrix'
        }]
    ],
    code: '',
    arduino: {
        code: '{LEDMATRIX}.showNum({NUMBER});'
    }
});
utils.preprocessBloq(mBotShowNumberOnLedMatrix);

module.exports = mBotShowNumberOnLedMatrix;