/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: botbloqHumanLateralDisplacement
 *
 * Bloq type: Statement
 *
 * Description: Move the human
 *
 */

var botbloqHumanLateralDisplacement = _.merge(_.clone(StatementBloq, true), {

    name: 'botbloqHumanLateralDisplacement',
    bloqClass: 'bloq-botbloq-human-lateraldisplacement',
    content: [
        [{
            alias: 'text',
            value: 'Moverse lateralmente hacia la'
        }, {
            id: 'FOOT',
            alias: 'staticDropdown',
            options: [{
                label: 'derecha.',
                value: 'RIGHT'
            }, {
                label: 'izquierda.',
                value: 'LEFT'
            }]
        }]
    ],
    code: '',
    python: {
        libraries: ['BotbloqHuman'],
        needInstanceOf: [{
            name: 'human',
            type: 'BotbloqHuman'
        }],
        codeLines: [{
            code: 'human.lateralDisplacement({FOOT})'
        }]
    }
});

utils.preprocessBloq(botbloqHumanLateralDisplacement);

module.exports = botbloqHumanLateralDisplacement;
