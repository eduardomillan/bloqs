/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'mapAdvanced',
    content: [
        [{
            alias: 'text',
            value: 'Mapear'
        }, {
            bloqInputId:'VAR',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'de ['
        }, {
            bloqInputId:'INITMIN',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: '-'
        }, {
            bloqInputId:'INITMAX',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: '] a ['
        }, {
            bloqInputId:'FINMIN',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: '-'
        }, {
            bloqInputId:'FINMAX',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: ']'
        }]
    ],
    code: 'map({VAR},{INITMIN},{INITMAX},{FINMIN},{FINMAX});'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;