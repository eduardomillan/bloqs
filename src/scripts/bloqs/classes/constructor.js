/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'constructorClass',
    bloqClass: 'bloq-constructor',
    content: [
        [{
            alias: 'text',
            value: 'bloq-constructor'
        }]
    ],
    code: '{CLASS-OUTSIDE}(){{STATEMENTS}};',
    hCode: '{CLASS-OUTSIDE} ();',
    cppCode: '{CLASS-OUTSIDE} :: {CLASS-OUTSIDE} (){{STATEMENTS}};'

});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;