/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    StatementBloq = require('./../../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'zowiMovementsAdvanced',
    bloqClass: 'bloq-zowi-movements-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-movements-advanced'
        }, {
            id: 'MOVEMENT',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-advanced-walk',
                value: 'walk'
            }, {
                label: 'bloq-zowi-movements-advanced-turn',
                value: 'turn'
            }, {
                label: 'bloq-zowi-movements-advanced-shakeLeg',
                value: 'shakeLeg'
            }, {
                label: 'bloq-zowi-movements-advanced-bend',
                value: 'bend'
            }]
        }, {
            id: 'DIR',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-advanced-forward',
                value: 'FORWARD'
            }, {
                label: 'bloq-zowi-movements-advanced-backward',
                value: 'BACKWARD'
            }, {
                label: 'bloq-zowi-movements-advanced-left',
                value: 'LEFT'
            }, {
                label: 'bloq-zowi-movements-advanced-right',
                value: 'RIGHT'
            }]
        }, {
            bloqInputId: 'STEPS',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-zowi-movements-advanced-speed'
        }, {
            bloqInputId: 'SPEED',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: 'zowi.{MOVEMENT}({STEPS},{SPEED},{DIR});'
});
utils.generateBloqInputConnectors(bloq);

module.exports = bloq;