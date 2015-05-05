/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'boolean',
    content: [
        [{
            id: 'STATE',
            alias: 'dropdown',
            options: [{label:'verdadero',value:'true'} , {label:'falso', value:'false'}]
        }]
    ],
    code: '{STATE}',
    returnType : 'bool'

});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;