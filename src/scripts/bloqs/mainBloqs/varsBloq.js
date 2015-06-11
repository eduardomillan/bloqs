 /*global require */
 'use strict';

 var _ = require('lodash'),
     utils = require('./../../utils'),
     GroupBloq = require('./../groupBloq');

 var bloq = _.merge(_.clone(GroupBloq, true), {

     name: 'varsBloq',
     bloqClass: 'bloq-vars',
     headerText: 'bloq-var-header',
     descriptionText: 'bloq-var-description',
     content: [],
     code: '{STATEMENTS}'
 });

 utils.generateBloqInputConnectors(bloq);


 module.exports = bloq;