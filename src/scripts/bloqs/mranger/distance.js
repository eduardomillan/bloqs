/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: mRangerGetDistance
 *
 * Bloq type: Output
 *
 *
 *
 * Return type: float
 */

var mRangerGetDistance = _.merge(_.clone(OutputBloq, true), {

    name: 'mRangerGetDistance',
    bloqClass: 'bloq-mranger-getdistance',
    content: [
        [{
            alias: 'text',
            value: 'bloq-mbot-getdistance-get'
        }, {
            id: 'PORT',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-mbot-port-6',
                value: '6'
            }, {
                label: 'bloq-mbot-port-7',
                value: '7'
            }, {
                label: 'bloq-mbot-port-8',
                value: '8'
            }, {
                label: 'bloq-mbot-port-9',
                value: '9'
            }, {
                label: 'bloq-mbot-port-10',
                value: '10'
            }]
        }]
    ],
    code: '',
    returnType: {
        type: 'simple',
        value: 'float'
    },
    arduino: {
        includes: ['BitbloqMRanger.h'],
        needInstanceOf: [{
            name: 'mRanger',
            type: 'MRanger'
        }],
        code: 'mRanger.getDistance({PORT})'
    }
});
utils.preprocessBloq(mRangerGetDistance);

module.exports = mRangerGetDistance;