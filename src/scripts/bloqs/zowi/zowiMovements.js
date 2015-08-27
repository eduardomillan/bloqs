/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'zowiMovements',
    bloqClass: 'bloq-zowi-movements',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-movements'
        }, {
            id: 'MOVEMENT',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-walk',
                value: 'walk'
            }, {
                label: 'bloq-zowi-movements-turn',
                value: 'turn'
            }, {
                label: 'bloq-zowi-movements-shakeleg',
                value: 'shakeleg'
            }, {
                label: 'bloq-zowi-movements-bend',
                value: 'bend'
            }]
        }, {
            id: 'DIR',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-forward',
                value: 'FORWARD'
            }, {
                label: 'bloq-zowi-movements-backward',
                value: 'BACKWARD'
            }, {
                label: 'bloq-zowi-movements-left',
                value: 'LEFT'
            }, {
                label: 'bloq-zowi-movements-right',
                value: 'RIGHT'
            }]
        }, {
            id: 'STEPS',
            alias: 'numberInput',
            value: 4
        }, {
            alias: 'text',
            value: 'bloq-zowi-movements-speed'
        }, {
            id: 'SPEED',
            alias: 'numberInput',
            value: 2000
        }]
    ],
    code: 'zowi.{MOVEMENT}({STEPS},{SPEED},{DIR});'
});
utils.generateBloqInputConnectors(bloq);

module.exports = bloq;