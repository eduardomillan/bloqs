/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'mathOperations',
    content: [
        [{
            id: 'OPERATOR',
            alias: 'dropdown',
            //'Raíz cuadrada', 'Valor absoluto', '-', 'ln', 'log10', 'e^', '10^']
            options: [{label:'Raíz cuadrada',value:'sqrt'},{label:'Valor absoluto',value:'abs'},{label:'ln',value:'log'},{label:'log10',value:'log10'},{label:'e^',value:'exp'}]
        }, {
            bloqInputId: 'ARG',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{OPERATOR}({ARG})',
    returnType: 'float'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;