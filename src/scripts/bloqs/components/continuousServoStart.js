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
            value: 'Girar servo'
        }, {
            id: 'SERVO',
            alias: 'dynamicDropdown',
            options: 'continuousServos'
        }, {
            alias: 'text',
            value: 'en sentido'
        }, {
            id: 'DIRECTION',
            alias: 'staticDropdown',
            options: [{
                label: 'horario',
                value: '0'
            }, {
                label: 'antihorario',
                value: '180'
            }]
        }]
    ],
    code: '{SERVO}.write({DIRECTION});'
});

utils.generateBloqInputConnectors(bloq);


module.exports = bloq;
