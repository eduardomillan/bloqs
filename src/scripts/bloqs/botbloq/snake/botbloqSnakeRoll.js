/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: botbloqSnakeRoll
 *
 * Bloq type: Statement
 *
 * Description: roll the snake
 *
 */

var botbloqSnakeRoll = _.merge(_.clone(StatementBloq, true), {

    name: 'botbloqSnakeRoll',
    bloqClass: 'bloq-botbloq-snake-roll',
    content: [
        [{
            alias: 'text',
            value: 'Rodar hacia la'
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
        }, {
            alias: 'text',
            value: 'durante'
        }, {
            id: 'DELAY',
            alias: 'numberInput',
            value: 1000
        }, {
            alias: 'text',
            value: 'ms'
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
            code: 'snake.roll("{SIDE}", {DELAY})'
        }]
    }
});

utils.preprocessBloq(botbloqSnakeRoll);

module.exports = botbloqSnakeRoll;