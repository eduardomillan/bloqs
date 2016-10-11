/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: mBotMoveAdvanced
 *
 * Bloq type: Statement
 *
 * Description: Move the vehicle forward
 *
 */

var mBotMoveAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'mBotMoveAdvanced',
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
            bloqInputId: 'SPEED',
            alias: 'bloqInput',
            acceptType: ['float'],
            suggestedBloqs: ['number', 'selectVariable']
        }]
    ],
    code: '',
    arduino: {
        includes: ['BitbloqMBot.h'],
        needInstanceOf: [{
            name: 'mBot',
            type: 'MBot'
        }],
        code: 'mBot.move({MOVEMENT},{SPEED});'
    }
});

utils.generateBloqInputConnectors(mBotMoveAdvanced);

module.exports = mBotMoveAdvanced;