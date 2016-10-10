/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: mBotMove
 *
 * Bloq type: Statement
 *
 * Description: Move the vehicle forward
 *
 */

var mBotMove = _.merge(_.clone(StatementBloq, true), {

    name: 'mBotMove',
    bloqClass: 'bloq-mbot-move',
    content: [
        [{
            id: 'MOVEMENT',
            alias: 'staticDropdown',
            options: [{
                label: 'Avanzar',
                value: '1'
            }, {
                label: 'Retroceder',
                value: '2'
            }, {
                label: 'Girar a la derecha',
                value: '3'
            }, {
                label: 'Girar a la izquierda',
                value: '4'
            }]
        }, {
            alias: 'text',
            value: 'a una velocidad'
        }, {
            id: 'SPEED',
            alias: 'staticDropdown',
            options: [{
                label: 'muy muy rápida',
                value: '255'
            }, {
                label: 'muy rápida',
                value: '100'
            }, {
                label: 'rápida',
                value: '50'
            }, {
                label: 'nula',
                value: '0'
            }, {
                label: 'despacio',
                value: '-50'
            }, {
                label: 'muy despacio',
                value: '-100'
            }, {
                label: 'muy muy despacio',
                value: '-255'
            }]
        }]
    ],
    code: '',
    arduino: {
        includes: ['mBot.h'],
        needInstanceOf: [{
            name: 'mBot',
            type: 'MBot'
        }],
        code: 'mBot.move({MOVEMENT},{SPEED});'
    }
});

utils.generateBloqInputConnectors(mBotMove);

module.exports = mBotMove;