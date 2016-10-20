/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: botbloqVehicleMove
 *
 * Bloq type: Statement
 *
 * Description: Move the vehicle forward
 *
 */

var botbloqVehicleMove = _.merge(_.clone(StatementBloq, true), {

    name: 'botbloqVehicleMove',
    bloqClass: 'bloq-botbloq-vehicle-move',
    content: [
        [{
            id: 'MOVEMENT',
            alias: 'staticDropdown',
            options: [{
                label: 'Avanzar',
                value: 'forward'
            }, {
                label: 'Retroceder',
                value: 'backward'
            }, {
                label: 'Girar a la derecha',
                value: 'right'
            }, {
                label: 'Girar a la izquierda',
                value: 'left'
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
            value: 'ms a una velocidad de'
        }, {
            id: 'SPEED',
            alias: 'numberInput',
            value: 5
        }]
    ],
    code: '',
    python: {
        libraries: ['BotbloqVehicle'],
        needInstanceOf: [{
            name: 'vehicle',
            type: 'BotbloqVehicle'
        }],
        codeLines: [{
            conditional: {
                aliasId: 'MOVEMENT',
                code: {
                    'forward': 'vehicle.avanzar({DELAY},{SPEED})',
                    'backward': 'vehicle.retroceder({DELAY},{SPEED})',
                    'right': 'vehicle.girarDerecha({DELAY},{SPEED})',
                    'left': 'vehicle.girarIzquierda({DELAY},{SPEED})'
                }
            }
        }]
    }
});

utils.generateBloqInputConnectors(botbloqVehicleMove);

module.exports = botbloqVehicleMove;