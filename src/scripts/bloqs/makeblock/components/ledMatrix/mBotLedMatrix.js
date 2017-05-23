/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../build-utils'),
    StatementBloq = require('./../../../statementBloq');

/**
 * Bloq name: buzzer
 *
 * Bloq type: Statement
 *
 * Description: It turns on a specific buzzer, selectable
 *              from a first drop-down, with a basic note,
 *              selectable from a second drop-down, during
 *              a given period of time.
 *
 * Return type: none
 */

var mBotLedMatrix = _.merge(_.clone(StatementBloq, true), {

    name: 'mBotLedMatrix',
    bloqClass: 'bloq-mbot-color',
    content: [
        [{
            alias: 'text',
            value: 'Dibujar'
        }, {
            id: 'DRAW',
            alias: 'dotsMatrix',
            options: {
                rows: 8,
                columns: 16
            }
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
        needInstanceOf: [{
            name: '{LEDMATRIX}_bitmap[16]',
            type: 'uint8_t',
            equals: '{DRAW}'

        }],
        code: '{LEDMATRIX}.drawBitmap(0,0, sizeof({LEDMATRIX}_bitmap), {LEDMATRIX}_bitmap);'
    }
});
utils.preprocessBloq(mBotLedMatrix);

module.exports = mBotLedMatrix;