var utils = utils || {};
utils.moveBloq = function(bloq, location) {
    "use strict";
    bloq.x(location.x);
    bloq.y(location.y);
};
utils.createConnectors = function(bloq, bloqData) {
    "use strict";
    var connectionThreshold = 20; // px
    bloq.connections = {};
    if (bloqData.inputs) {
        bloq.connections.inputs = {
            connectionPosition: {},
            connectorArea: {},
            type : bloqData.inputs
        };
        bloq.connections.inputs.connectionPosition = {
            x: bloq.x()+bloq.size.width,
            y: bloq.y()
        };
        bloq.connections.inputs.connectorArea = {
            x1: bloq.x() + bloq.size.width - connectionThreshold,
            x2: bloq.x() + bloq.size.width + connectionThreshold,
            y1: bloq.y(),
            y2: bloq.y() + connectionThreshold
        };
        bloq.rect(connectionThreshold*2, connectionThreshold).attr({
            fill: '#000'
        }).move(bloq.size.width - connectionThreshold,0);
    }
    if (bloqData.output) {
        bloq.connections.output = {
            connectionPosition: {},
            connectorArea: {},
            type : bloqData.output
        };
        bloq.connections.output.connectionPosition = {
            x: bloq.x(),
            y: bloq.y()
        };
        bloq.connections.output.connectorArea = {
            x1: bloq.x() - connectionThreshold,
            x2: bloq.x() + connectionThreshold,
            y1: bloq.y(),
            y2: bloq.y() + connectionThreshold
        };
        bloq.rect(connectionThreshold * 2, connectionThreshold).attr({
            fill: '#000'
        }).move(-connectionThreshold,0);
    }
    if (bloqData.up) {
        bloq.connections.up = {
            connectionPosition: {},
            connectorArea: {}
        };
        bloq.connections.up.connectionPosition = {
            x: bloq.x(),
            y: bloq.y()
        };
        bloq.connections.up.connectorArea = {
            x1: bloq.x(),
            x2: bloq.x() + bloq.size.width,
            y1: bloq.y() - connectionThreshold,
            y2: bloq.y() + connectionThreshold
        };
        bloq.rect(bloq.size.width + 10, connectionThreshold * 2).attr({
            fill: '#000'
        }).move(0, -connectionThreshold);
    }
    if (bloqData.down) {
        bloq.connections.down = {
            connectionPosition: {},
            connectorArea: {}
        };
        bloq.connections.down.connectionPosition = {
            x: bloq.x(),
            y: bloq.y() + bloq.size.height
        };
        bloq.connections.down.connectorArea = {
            x1: bloq.x(),
            x2: bloq.x() + bloq.size.width,
            y1: bloq.y() + bloq.size.height - connectionThreshold,
            y2: bloq.y() + bloq.size.height + connectionThreshold
        };
        bloq.rect(bloq.size.width + 10, connectionThreshold * 2).attr({
            fill: '#000'
        }).move(0, bloq.size.height - connectionThreshold);
    }
    return bloq.connections;
};
/**
 * Updates de position of the connectors of a bloq (used after modifying the bloq's position)
 * @param bloq
 */
utils.updateConnectors = function(bloq) {
    "use strict";
    for (var type in bloq.connections) {
        // if (bloq.connections[type] && type === 'inputs') {
        //     for (var i in bloq.connections[type]) {
        //         bloq.connections[type][i].connectionPosition.x += bloq.delta.x;
        //         bloq.connections[type][i].connectionPosition.y += bloq.delta.y;
        //         bloq.connections[type][i].connectorArea.x1 += bloq.delta.x;
        //         bloq.connections[type][i].connectorArea.x2 += bloq.delta.x;
        //         bloq.connections[type][i].connectorArea.y1 += bloq.delta.y;
        //         bloq.connections[type][i].connectorArea.y2 += bloq.delta.y;
        //     }
        // } else 
        if (bloq.connections[type]) {
            bloq.connections[type].connectionPosition.x += bloq.delta.x;
            bloq.connections[type].connectionPosition.y += bloq.delta.y;
            bloq.connections[type].connectorArea.x1 += bloq.delta.x;
            bloq.connections[type].connectorArea.x2 += bloq.delta.x;
            bloq.connections[type].connectorArea.y1 += bloq.delta.y;
            bloq.connections[type].connectorArea.y2 += bloq.delta.y;
        }
    }
    return bloq.connections;
};
utils.oppositeConnection = {
    inputs: 'output',
    output: 'inputs',
    up: 'down',
    down: 'up'
};