/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'led',
    bloqClass: 'bloq-led',
    content: [
        [{
            id: 'STATE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-led-turnon',
                value: 'HIGH'
            }, {
                label: 'bloq-led-turnoff',
                value: 'LOW'
            }]
        }, {
            alias: 'text',
            value: 'bloq-led-theLED'
        }, {
            id: 'LED',
            alias: 'dynamicDropdown',
            options: 'leds'
        }]
    ],
    code: 'digitalWrite({LED},{STATE});'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;