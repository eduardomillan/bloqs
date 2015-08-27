/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'zowiMovementsHeight',
    bloqClass: 'bloq-zowi-movements-height',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-movements-height'
        }, {
            id: 'MOVEMENT',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-height-moonwalker',
                value: 'moonwalker'
            }, {
                label: 'bloq-zowi-movements-height-crusaito',
                value: 'crusaito'
            }, {
                label: 'bloq-zowi-movements-height-flapping',
                value: 'flapping'
            }]
        }, {
            id: 'DIR',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-height-forward',
                value: 'FORWARD'
            }, {
                label: 'bloq-zowi-movements-height-backward',
                value: 'BACKWARD'
            }, {
                label: 'bloq-zowi-movements-height-left',
                value: 'LEFT'
            }, {
                label: 'bloq-zowi-movements-height-right',
                value: 'RIGHT'
            }]
        }, {
            id: 'STEPS',
            alias: 'numberInput',
            value: 4
        }, {
            alias: 'text',
            value: 'bloq-zowi-movements-height-speed'
        }, {
            id: 'SPEED',
            alias: 'numberInput',
            value: 2000
        }, {
            alias: 'text',
            value: 'bloq-zowi-movements-height-height'
        }, {
            id: 'HEIGHT',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-height-big',
                value: 'BIG'
            }, {
                label: 'bloq-zowi-movements-height-medium',
                value: 'MEDIUM'
            }, {
                label: 'bloq-zowi-movements-height-small',
                value: 'SMALL'
            }]
        }]
    ],
    code: 'zowi.{MOVEMENT}({STEPS},{SPEED},{HEIGHT},{DIR});'
});
utils.generateBloqInputConnectors(bloq);

module.exports = bloq;