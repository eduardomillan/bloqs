/*global define */
'use strict';

define(['lodash'], function(_) {
    var StatementBLoq = function() {};
    StatementBLoq.prototype.type = 'statement';
    StatementBLoq.prototype.connectors = [{
        type: 'connector-top',
        accept: ['connector-bottom']

    }, {
        type: 'connector-bottom',
        accept: ['connector-top']

    }];
    return new StatementBLoq();
});