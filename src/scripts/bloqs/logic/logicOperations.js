/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'logicOperations',
    content: [
        [{
            bloqInputId:'ARG1',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            id:'OPERATOR',
            alias: 'dropdown',
            options: [{label:'y', value:'&&'}, {label:'o', value:'||'}]
        }, {
            bloqInputId:'ARG2',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{ARG1}{OPERATOR}{ARG2}', 
    returnType: 'bool'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;