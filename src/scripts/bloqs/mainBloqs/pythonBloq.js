 /*global require */
 'use strict';

 var _ = require('lodash'),
     utils = require('./../build-utils'),
     GroupBloq = require('./../groupBloq');

 /**
  * Bloq name: pythonBloq
  *
  * Bloq type: group
  *
  * Description: It is used to storage the bloqs wanted
  *              to be executed only once at the beginning
  *              of the program.
  *
  * Return type: none
  */

 var pythonBloq = _.merge(_.clone(GroupBloq, true), {

     name: 'pythonBloq',
     bloqClass: 'bloq-python',
     content: [],
     python: {
         codeLines: [{
             code: '# coding=utf-8'
         }, {
             code: '{STATEMENTS}'
         }]
     }
 });

 utils.generateBloqInputConnectors(pythonBloq);


 module.exports = pythonBloq;