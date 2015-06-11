/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    StatementBloq = require('./../../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'lcdTurnOnOffAdvanced',
    bloqClass: 'bloq-lcd-turn-on-off-advanced',
    content: [
        [{
            id: 'STATE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-lcd-turn-on-off-advanced-turnon',
                value: 'HIGH'
            }, {
                label: 'bloq-lcd-turn-on-off-advanced-turnoff',
                value: 'LOW'
            }]
        }, {
            alias: 'text',
            value: 'bloq-lcd-turn-on-off-advanced-lcdLigth'
        }, {
            bloqInputId: 'LCD',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{LCD}.setBacklight({STATE});'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;