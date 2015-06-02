 /*global require */
 'use strict';

 var _ = require('lodash'),
     utils = require('./../../utils'),
     GroupBloq = require('./../groupBloq');

 var bloq = _.merge(_.clone(GroupBloq, true), {

     name: 'loopBloq',
     bloqClass: 'bloq-loop',
     headerText: 'Loop',
     descriptionText: 'Crea el programa que se va a ejecutar continuamente después del Setup.',
     content: [],
     code: 'void loop(){{STATEMENTS}}'

 });

 utils.generateBloqInputConnectors(bloq);


 module.exports = bloq;