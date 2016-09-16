/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
* Bloq name: mBotSetLedAdvanced
*
* Bloq type: Statement
*
*
*
*/

var mBotSetLedAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'mBotSetLedAdvanced',
    bloqClass: 'bloq-mbot-setled-advanced',
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
                label: 'el led 1',
                value: '1'
            },{
                label: 'el led 2',
                value: '2'
            },{
                label: 'el led 3',
                value: '3'
            },{
                label: 'el led 4',
                value: '4'
            }]
        },
        {
            alias: 'text',
            value: 'del '
        },
        {
            id: 'PORT',
            alias: 'staticDropdown',
            options: [{
                label: 'puerto 1',
                value: '1'
            },{
                label: 'puerto 2',
                value: '2'
            },{
                label: 'puerto 3',
                value: '3'
            },{
                label: 'puerto 4',
                value: '4'
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
        code: 'mBot.setLed({PORT}, {LEDS}, {RED}, {GREEN}, {BLUE});'
    }
});

utils.generateBloqInputConnectors(mBotSetLedAdvanced);

module.exports = mBotSetLedAdvanced;
