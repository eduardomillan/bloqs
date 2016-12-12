/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: botbloqSnakeLateralDisplacement
 *
 * Bloq type: Statement
 *
 * Description: move the snake
 *
 */

var botbloqSnakeLateralDisplacement = _.merge(_.clone(StatementBloq, true), {

    name: 'botbloqSnakeLateralDisplacement',
    bloqClass: 'bloq-botbloq-snake-lateraldisplacement',
    content: [
        [{
            alias: 'text',
            value: 'Moverse lateralmente hacia la'
        }, {
            id: 'SIDE',
            alias: 'staticDropdown',
            options: [{
                label: 'derecha',
                value: 'RIGHT'
            }, {
                label: 'izquierda',
                value: 'LEFT'
            }]
        }]
    ],
    code: '',
    python: {
        libraries: ['BotbloqSnake'],
        needInstanceOf: [{
            name: 'snake',
            type: 'BotbloqSnake'
        }],
        codeLines: [{
            code: 'snake.lateralDisplacement("{SIDE}")'
        }]
    }
});

utils.preprocessBloq(botbloqSnakeLateralDisplacement);

module.exports = botbloqSnakeLateralDisplacement;