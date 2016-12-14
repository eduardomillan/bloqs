/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: mRangerLineFollower
 *
 * Bloq type: Output
 *
 *
 *
 * Return type: float
 */

var mRangerLineFollower = _.merge(_.clone(OutputBloq, true), {

    name: 'mRangerLineFollower',
    bloqClass: 'bloq-mranger-linefollower',
    content: [
        [{
            alias: 'text',
            value: 'bloq-mranger-linefollower-text'
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
        code: 'mRanger.getLineFollower({PORT})'
    }
});
utils.preprocessBloq(mRangerLineFollower);

module.exports = mRangerLineFollower;