/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'continuousServoStart',
    bloqClass: 'bloq-continuous-servo-start',
    content: [
        [{
            alias: 'text',
            value: 'bloq-continuous-servo-start-turn'
        }, {
            id: 'SERVO',
            alias: 'dynamicDropdown',
            options: 'continuousServos'
        }, {
            alias: 'text',
            value: 'bloq-continuous-servo-start-direction'
        }, {
            id: 'DIRECTION',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-continuous-servo-start-clockwise',
                value: '180'
            }, {
                label: 'bloq-continuous-servo-start-counterclockwise',
                value: '0'
            }]
        }]
    ],
    code: '{SERVO}.write({DIRECTION});'
});

utils.generateBloqInputConnectors(bloq);


module.exports = bloq;
