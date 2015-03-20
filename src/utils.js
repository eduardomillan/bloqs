var utils = utils || {};
utils.moveBloq = function(bloq, location) {
    "use strict";
    bloq.x(location.x);
    bloq.y(location.y);
};
utils.moveBloq2 = function(bloq, delta) {
    "use strict";
    bloq.x(bloq.x()+delta.x);
    bloq.y(bloq.y()+delta.y);
};
utils.createConnectors = function(bloq, bloqData) {
    "use strict";
    var connectionThreshold = 20; // px
    bloq.connections = {};
    if (bloqData.inputs) {
        bloq.connections.inputs = [{}];
        for (var i in bloqData.inputs) {
            i = parseInt(i, 10);
            bloq.connections.inputs[i] = {
                connectionPosition: {},
                connectorArea: {},
                type: ''
            };
            bloq.connections.inputs[i].connectionPosition = {
                x: bloq.x() + bloq.size.width,
                y: bloq.y() + i * connectionThreshold
            };
            bloq.connections.inputs[i].connectorArea = {
                x1: bloq.x() + bloq.size.width - connectionThreshold,
                x2: bloq.x() + bloq.size.width + connectionThreshold,
                y1: bloq.y() + i * connectionThreshold,
                y2: bloq.y() + i * connectionThreshold + connectionThreshold
            };
            bloq.connections.inputs[i].type = bloqData.inputs[i];
            bloq.connections.inputs[i].UI = bloq.rect(connectionThreshold * 2, connectionThreshold).attr({
                fill: '#FFCC33'
            }).move(bloq.size.width - connectionThreshold, i * connectionThreshold);
        }
        console.log('inputs :::', bloq.connections.inputs);
    }
    if (bloqData.output) {
        bloq.connections.output = {
            connectionPosition: {},
            connectorArea: {},
            type: bloqData.output
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
        bloq.connections.output.UI = bloq.rect(connectionThreshold * 2, connectionThreshold).attr({
            fill: '#FFCC33'
        }).move(-connectionThreshold, 0);
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
            x2: bloq.x() + connectionThreshold,
            y1: bloq.y() - connectionThreshold,
            y2: bloq.y() + connectionThreshold
        };
        bloq.connections.up.UI = bloq.rect(connectionThreshold, connectionThreshold * 2).attr({
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
            x2: bloq.x() + connectionThreshold,
            y1: bloq.y() + bloq.size.height - connectionThreshold,
            y2: bloq.y() + bloq.size.height + connectionThreshold
        };
        bloq.connections.down.UI = bloq.rect(connectionThreshold, connectionThreshold * 2).attr({
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
        if (bloq.connections[type] && type === 'inputs') {
            for (var i in bloq.connections[type]) {
                bloq.connections[type][i].connectionPosition.x += bloq.delta.x;
                bloq.connections[type][i].connectionPosition.y += bloq.delta.y;
                bloq.connections[type][i].connectorArea.x1 += bloq.delta.x;
                bloq.connections[type][i].connectorArea.x2 += bloq.delta.x;
                bloq.connections[type][i].connectorArea.y1 += bloq.delta.y;
                bloq.connections[type][i].connectorArea.y2 += bloq.delta.y;
            }
        } else if (bloq.connections[type]) {
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
utils.updateConnector = function(connector, delta) {
    "use strict";
    connector.connectionPosition.x += delta.x;
    connector.connectionPosition.y += delta.y;
    connector.connectorArea.x1 += delta.x;
    connector.connectorArea.x2 += delta.x;
    connector.connectorArea.y1 += delta.y;
    connector.connectorArea.y2 += delta.y;
    console.log('connector.UI movement!', delta.x, delta.y);
    connector.UI.move(connector.UI.x() + delta.x, connector.UI.y() + delta.y);
    return connector;
};
utils.oppositeConnection = {
    inputs: 'output',
    output: 'inputs',
    up: 'down',
    down: 'up'
};
utils.manageConnections = function(type, bloq1Connection, bloq2Connection, bloq1, bloq2, inputID) {
    "use strict";
    if (bloq2Connection !== undefined && bloq1Connection !== undefined) {
        if (bloq1Connection.type === bloq2Connection.type) { // if the type is the same
            if (bloq1.itsOver(bloq1Connection.connectorArea, bloq2Connection.connectorArea)) {
                console.log('isover!! ---> ', type);
                bloq1.delta.x = bloq2Connection.connectorArea.x1 - bloq1Connection.connectorArea.x1;
                bloq1.delta.y = bloq2Connection.connectorArea.y1 - bloq1Connection.connectorArea.y1;
                utils.moveBloq(bloq1, bloq2.getConnectionPosition(utils.oppositeConnection[type], bloq1, inputID));
                if (type === 'inputs' || type === 'down') {
                    bloq1.updateBloqs(bloq1, bloq2, type, inputID);
                    bloq1Connection.bloq = bloq2;
                } else {
                    bloq1.updateBloqs(bloq2, bloq1, type, inputID);
                    bloq2Connection.bloq = bloq1;
                }
                bloq1.connections = utils.updateConnectors(bloq1, type);
                bloq1.delta.lastx = 0;
                bloq1.delta.lasty = 0;
                return true;
            } else {
                console.log('not over');
            }
        }
    }
    return false;
};