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

var mBotShowStringOnLedMatrix = _.merge(_.clone(StatementBloq, true), {

    name: 'mBotShowStringOnLedMatrix',
    bloqClass: 'bloq-mbot-color',
    content: [
        [{
            alias: 'text',
            value: 'Escribir'
        }, {
            id: 'TEXT',
            alias: 'stringInput'
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
        code: '{LEDMATRIX}.drawStr(0,7,"{TEXT}");'
    }
});
utils.preprocessBloq(mBotShowStringOnLedMatrix);

module.exports = mBotShowStringOnLedMatrix;