/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'zowiMovementsNoDir',
    bloqClass: 'bloq-zowi-movements-no-dir',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-movements-no-dir'
        }, {
            id: 'MOVEMENT',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-no-dir-updown',
                value: 'updown'
            }, {
                label: 'bloq-zowi-movements-no-dir-swing',
                value: 'swing'
            }, {
                label: 'bloq-zowi-movements-no-dir-tiptoeSwing',
                value: 'tiptoeSwing'
            }, {
                label: 'bloq-zowi-movements-no-dir-jitter',
                value: 'jitter'
            }, {
                label: 'bloq-zowi-movements-no-dir-ascendingTurn',
                value: 'ascendingTurn'
            }, {
                label: 'bloq-zowi-movements-no-dir-jump',
                value: 'jump'
            }]
        }, {
            id: 'STEPS',
            alias: 'numberInput',
            value: 4
        }, {
            alias: 'text',
            value: 'bloq-zowi-movements-no-dir-speed'
        }, {
            id: 'SPEED',
            alias: 'numberInput',
            value: 2000
        }, {
            alias: 'text',
            value: 'bloq-zowi-movements-no-dir-height'
        }, {
            id: 'HEIGHT',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-no-dir-big',
                value: 'BIG'
            }, {
                label: 'bloq-zowi-movements-no-dir-medium',
                value: 'MEDIUM'
            }, {
                label: 'bloq-zowi-movements-no-dir-small',
                value: 'SMALL'
            }]
        }]
    ],
    code: 'zowi.{MOVEMENT}({STEPS},{SPEED},{HEIGHT});'
});
utils.generateBloqInputConnectors(bloq);

module.exports = bloq;