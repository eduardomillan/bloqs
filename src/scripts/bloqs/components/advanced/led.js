/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    StatementBloq = require('./../../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'ledAdvanced',
    bloqClass: 'bloq-led-advanced',
    content: [
        [{
            id: 'STATE',
            alias: 'staticDropdown',
            options: [{
                label: 'Encender',
                value: 'HIGH'
            }, {
                label: 'Apagar',
                value: 'LOW'
            }]
        },  {
            alias: 'text',
            value: 'el LED'
        }, {
            bloqInputId: 'LED',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: 'digitalWrite({LED},{STATE});'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;
