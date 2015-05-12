 /*global require */
 'use strict';

 var _ = require('lodash'),
     utils = require('./../../utils'),
     GroupBloq = require('./../groupBloq');

 var bloq = _.merge(_.clone(GroupBloq, true), {

     name: 'setupBloq',
     headerText: 'Setup',
     descriptionText: 'Define los valores que vas a utilizar en Setup y Loop, también puedes hacer funciones para agrupar bloques',
     content: [],
     code: 'void setup(){{STATEMENTS}}'
 });

 utils.generateBloqInputConnectors(bloq);


 module.exports = bloq;
