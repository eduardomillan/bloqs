/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: botbloqHexapodLateralDisplacement
 *
 * Bloq type: Statement
 *
 * Description: Move the hexapode
 *
 */

var botbloqHexapodLateralDisplacement = _.merge(_.clone(StatementBloq, true), {

    name: 'botbloqHexapodLateralDisplacement',
    bloqClass: 'bloq-botbloq-hexapod-lateraldisplacement',
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
        libraries: ['BotbloqHexapod'],
        needInstanceOf: [{
            name: 'hexapod',
            type: 'BotbloqHexapod'
        }],
        codeLines: [{
            code: 'hexapod.lateralDisplacement("{SIDE}")'
        }]
    }
});

utils.preprocessBloq(botbloqHexapodLateralDisplacement);

module.exports = botbloqHexapodLateralDisplacement;