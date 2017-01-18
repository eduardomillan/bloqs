/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: botbloqHexapodMove
 *
 * Bloq type: Statement
 *
 * Description: Move the hexapode
 *
 */

var botbloqHexapodMove = _.merge(_.clone(StatementBloq, true), {

    name: 'botbloqHexapodMove',
    bloqClass: 'bloq-botbloq-hexapod-move',
    content: [
        [{
            id: 'MOVEMENT',
            alias: 'staticDropdown',
            options: [{
                label: 'Avanzar',
                value: 'FORWARD'
            }, {
                label: 'Retroceder',
                value: 'BACKWARD'
            }, {
                label: 'Girar a la derecha',
                value: 'TURN_RIGHT'
            }, {
                label: 'Girar a la izquierda',
                value: 'TURN_LEFT'
            }]
        }, {
            id: 'STEPS',
            alias: 'numberInput',
            value: 3
        }, {
            alias: 'text',
            value: 'pasos'
        }]
    ],
    code: '',
    python: {
        libraries: ['BotbloqHexapod'],
        needInstanceOf: [{
            name: 'hexapod',
            type: 'BotbloqHexapod'
        }],
        codeLines: [{
            code: 'hexapod.move("{MOVEMENT}", {STEPS})'
        }]
    }
});

utils.preprocessBloq(botbloqHexapodMove);

module.exports = botbloqHexapodMove;