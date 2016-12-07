/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: botbloqSnakeMove
 *
 * Bloq type: Statement
 *
 * Description: Move the snake
 *
 */

var botbloqSnakeMove = _.merge(_.clone(StatementBloq, true), {

    name: 'botbloqSnakeMove',
    bloqClass: 'bloq-botbloq-snake-move',
    content: [
        [{
            id: 'MOVEMENT',
            alias: 'staticDropdown',
            options: [{
                label: 'Avanzar.',
                value: 'FORWARD'
            }, {
                label: 'Retroceder.',
                value: 'BACKWARD'
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
            code: 'snake.move("{MOVEMENT}")'
        }]
    }
});

utils.preprocessBloq(botbloqSnakeMove);

module.exports = botbloqSnakeMove;