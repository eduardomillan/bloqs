/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../build-utils'),
    StatementBloq = require('./../../../statementBloq');

/**
 * Bloq name: evolutionIfDistance
 *
 * Bloq type: Statement-Input
 *
 * Description: It executes the following code only if Evolution detects
 *              a specific distance.
 *
 * Return type: none
 */

var freakscarCollision = _.merge(_.clone(StatementBloq, true), {

    name: 'freakscarCollision',
    bloqClass: 'bloq-freakscar-color',
    content: [
        [{
            alias: 'text',
            value: 'bloq-evolution-if-collision'
        }]
    ],
    code: '',
    arduino: {
        code: 'if(robot.readEndStop() == HIGH){{STATEMENTS}}'

    }
});

utils.preprocessBloq(freakscarCollision);

module.exports = freakscarCollision;
