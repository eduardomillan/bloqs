 /*global require */
 'use strict';

 var _ = require('lodash'),
     utils = require('./../../utils'),
     GroupBloq = require('./../groupBloq');

 var bloq = _.merge(_.clone(GroupBloq, true), {

     name: 'loopBloq',
     bloqClass: 'bloq-loop',
     headerText: 'Loop',
     descriptionText: 'Define los valores que vas a utilizar en Setup y Loop, también puedes hacer funciones para agrupar bloques',
     content: [],
     code: 'void loop(){{STATEMENTS}}'

 });

 utils.generateBloqInputConnectors(bloq);


 module.exports = bloq;