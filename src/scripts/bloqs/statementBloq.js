/*global define */
'use strict';

define(function() {
    return {
        type: 'statement',
        connectors: [{
            type: 'connector-top',
            accept: ['connector-bottom']

        }, {
            type: 'connector-bottom',
            accept: ['connector-top']

        }]
    };
});