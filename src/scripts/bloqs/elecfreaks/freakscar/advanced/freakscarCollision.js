/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../build-utils'),
    StatementInputBloq = require('./../../../statementInputBloq');

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

var freakscarCollision = _.merge(_.clone(StatementInputBloq, true), {

    name: 'freakscarIfDistance',
    bloqClass: 'bloq-freakscar-color',
    content: [
        [{
            alias: 'text',
            value: 'bloq-evolution-if-collision'
        }]
    ],
    code: '',
    arduino: {
        conditional: {
            aliasId: 'MAGNITUDE',
            code: 'if(robot.readEndStop() == HIGH){{STATEMENTS}}'

        }
    }
});

freakscarCollision.connectors[1].acceptedAliases = ['all', 'ifDown'];

utils.preprocessBloq(freakscarCollision);

module.exports = freakscarCollision;
