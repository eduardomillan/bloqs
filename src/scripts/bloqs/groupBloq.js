'use strict';

var bloq = {

    type: 'group',
    connectors: [{
        type: 'connector--empty'
    }, {
        type: 'connector--empty'
    }, {
        type: 'connector--root',
        accept: 'connector--top'
    }]
};

module.exports = bloq;