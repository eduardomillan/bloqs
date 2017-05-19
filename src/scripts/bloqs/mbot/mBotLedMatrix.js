/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

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
    bloqClass: 'mbot-blue',
    content: [
        [{
            alias: 'text',
            value: 'mostrar'
        }, {
            id: 'DRAW',
            alias: 'dotsMatrix',
            options: {
                width: 100,
                height: 100,
                rows: 8,
                columns: 16
            }
        }, {
            alias: 'text',
            value: 'en el'
        }, {
            id: 'LEDMATRIX',
            alias: 'dynamicDropdown',
            options: 'ledMatrix'
        }]
    ],
    code: '',
    arduino: {
        code: 'robot.playTone({NOTE},{SECONDS});\ndelay({SECONDS});'
    }
});
utils.preprocessBloq(mBotLedMatrix);

module.exports = mBotLedMatrix;