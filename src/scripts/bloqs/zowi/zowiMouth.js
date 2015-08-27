/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'zowiMouth',
    bloqClass: 'bloq-zowi-mouth',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-mouth'
        }, {
            id: 'GESTURE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-mouth-smile',
                value: 'smile_code'
            }, {
                label: 'bloq-zowi-mouth-sad',
                value: 'sad_code'
            }, {
                label: 'bloq-zowi-mouth-happy',
                value: 'happyOpenMouth_code'
            }]
        }, {
            alias: 'text',
            value: 'bloq-zowi-mouth-mouth'
        }]
    ],
    code: 'ledmatrix.writeFull(mouth[{GESTURE}]);'
});
utils.generateBloqInputConnectors(bloq);

module.exports = bloq;