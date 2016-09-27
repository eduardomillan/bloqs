/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
* Bloq name: mBotSetLed
*
* Bloq type: Statement
*
*
*
*/

var mBotSetLed = _.merge(_.clone(StatementBloq, true), {

    name: 'mBotSetLed',
    bloqClass: 'bloq-mbot-setled',
    content: [
        [{
            alias: 'text',
            value: 'Establecer '
        },{
            id: 'LEDS',
            alias: 'staticDropdown',
            options: [{
                label: 'todos los leds',
                value: '0'
            }, {
                label: 'el led derecho',
                value: '1'
            },{
                label: 'el led izquierdo',
                value: '2'
            }]
        },
        {
            alias: 'text',
            value: 'con esta mezcla de colores:'
        },
        {
            alias: 'text',
            value: 'rojo:'
        },
        {
            id: 'RED',
            alias: 'numberInput',
            value: 0
        },
        {
            alias: 'text',
            value: 'verde:'
        },
        {
            id: 'GREEN',
            alias: 'numberInput',
            value: 0
        },
        {
            alias: 'text',
            value: 'azul:'
        },
        {
            id: 'BLUE',
            alias: 'numberInput',
            value: 0
        }]
    ],
    code: '',
    arduino:{
        includes:['mBot.h' ],
        needInstanceOf:[{
            name: 'mBot',
            type: 'MBot'
        }],
        code: 'mBot.setLed(7, {LEDS}, {RED}, {GREEN}, {BLUE});'
    }
});

utils.generateBloqInputConnectors(mBotSetLed);

module.exports = mBotSetLed;
