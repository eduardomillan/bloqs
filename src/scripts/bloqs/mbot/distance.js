/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: mBotGetDistance
 *
 * Bloq type: Output
 *
 *
 *
 * Return type: float
 */

var mBotGetDistance = _.merge(_.clone(OutputBloq, true), {

    name: 'mBotGetDistance',
    bloqClass: 'bloq-mbot-getdistance',
    content: [
        [{
            alias: 'text',
            value: 'Obtener la distancia del ultrasonidos en el'
        },
        {
            id: 'PORT',
            alias: 'staticDropdown',
            options: [{
                label: 'puerto 1',
                value: '1'
            }, {
                label: 'puerto 2',
                value: '2'
            },{
                label: 'puerto 3',
                value: '3'
            },{
                label: 'puerto 4',
                value: '4'
            }]
        }]
    ],
    code: '',
    returnType: {
        type: 'simple',
        value: 'float'
    },
    arduino:{
        includes:['mBot.h' ],
        needInstanceOf:[{
            name: 'mBot',
            type: 'MBot'
        }],
        code: 'mBot.getDistance({PORT})'
    }
});
utils.generateBloqInputConnectors(mBotGetDistance);

module.exports = mBotGetDistance;
