 /*global require */
 'use strict';

 var _ = require('lodash'),
     utils = require('./../../utils'),
     GroupBloq = require('./../groupBloq');

 var bloq = _.merge(_.clone(GroupBloq, true), {

     name: 'setupBloq',
     bloqClass: 'bloq-setup',
     headerText: 'Setup',
     descriptionText: 'Indica lo que quieres que se ejecute al inicio del programa y sólo una única vez.',
     content: [],
     code: 'void setup(){{STATEMENTS}}'
 });

 utils.generateBloqInputConnectors(bloq);


 module.exports = bloq;