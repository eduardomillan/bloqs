/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'continuousServoStop',
    bloqClass: 'bloq-continuous-servo-stop',
    content: [
        [{
            alias: 'text',
            value: 'bloq-continuous-servo-stop-stop'
        }, {
            id: 'SERVO',
            alias: 'dynamicDropdown',
            options: 'continuousServos'
        }]
    ],
    code: '{SERVO}.write(90);'
});

utils.generateBloqInputConnectors(bloq);


module.exports = bloq;