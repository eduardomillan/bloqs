var utils = utils || {};
var connectionThreshold = 20; // px
utils.moveBloq = function(bloq, location) {
    "use strict";
    bloq.x(location.x);
    bloq.y(location.y);
};
utils.moveBloq2 = function(bloq, delta) {
    "use strict";
    bloq.x(bloq.x() + delta.x);
    bloq.y(bloq.y() + delta.y);
    bloq.connections = utils.updateConnectors(bloq, delta);
};

function getRandomColor() {
    "use strict";
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
utils.addInput = function(bloq, posx, posy, type) {
    "use strict";
    var index = 0;
    if (bloq.connections.inputs !== undefined) {
        index = bloq.connections.inputs.length;
    } else {
        bloq.connections.inputs = [{}];
    }
    bloq.connections.inputs[index] = {
        connectionPosition: {
            x: posx,
            y: posy
        },
        connectorArea: {
            x1: posx - connectionThreshold,
            x2: posx + connectionThreshold,
            y1: posy,
            y2: posy + connectionThreshold
        },
        type: type,
        inline: true,
        movedDown: false,
        UI: canvas.group().rect(connectionThreshold * 2, connectionThreshold).attr({
            fill: getRandomColor()
        }).move(posx - connectionThreshold, posy)
    };
    console.log('-------------------------', bloq.connections.inputs);
    bloq.inputsNumber = bloq.connections.inputs.length;
};
utils.createConnectors = function(bloq, bloqData) {
    "use strict";
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
            bloq.connections.inputs[i].movedDown = false;
            //Update bloq's size
            utils.resizeBloq(bloq, {
                x: 0,
                y: connectionThreshold
            });
            bloq.connections.inputs[i].UI = canvas.group().rect(connectionThreshold * 2, connectionThreshold).attr({
                fill: getRandomColor()
            }).move(bloq.x() + bloq.size.width - connectionThreshold, bloq.y() + i * connectionThreshold);
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
        bloq.connections.output.UI = canvas.group().rect(connectionThreshold * 2, connectionThreshold).attr({
            fill: '#FFCC33'
        }).move(bloq.x() - connectionThreshold, bloq.y());
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
        bloq.connections.up.UI = canvas.group().rect(connectionThreshold, connectionThreshold * 2).attr({
            fill: '#000'
        }).move(bloq.x(), bloq.y() - connectionThreshold);
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
        bloq.connections.down.UI = canvas.group().rect(connectionThreshold, connectionThreshold * 2).attr({
            fill: '#000'
        }).move(bloq.x(), bloq.y() + bloq.size.height - connectionThreshold);
    }
    return bloq.connections;
};
/**
 * Updates de position of the connectors of a bloq (used after modifying the bloq's position)
 * @param bloq
 */
utils.updateConnectors = function(bloq, delta) {
    "use strict";
    for (var type in bloq.connections) {
        if (bloq.connections[type] && type === 'inputs') {
            for (var i in bloq.connections[type]) {
                bloq.connections[type][i].connectionPosition.x += delta.x;
                bloq.connections[type][i].connectionPosition.y += delta.y;
                bloq.connections[type][i].connectorArea.x1 += delta.x;
                bloq.connections[type][i].connectorArea.x2 += delta.x;
                bloq.connections[type][i].connectorArea.y1 += delta.y;
                bloq.connections[type][i].connectorArea.y2 += delta.y;
                bloq.connections[type][i].UI.move(bloq.connections[type][i].UI.x() + delta.x, bloq.connections[type][i].UI.y() + delta.y);
            }
        } else if (bloq.connections[type]) {
            bloq.connections[type].connectionPosition.x += delta.x;
            bloq.connections[type].connectionPosition.y += delta.y;
            bloq.connections[type].connectorArea.x1 += delta.x;
            bloq.connections[type].connectorArea.x2 += delta.x;
            bloq.connections[type].connectorArea.y1 += delta.y;
            bloq.connections[type].connectorArea.y2 += delta.y;
            bloq.connections[type].UI.move(bloq.connections[type].UI.x() + delta.x, bloq.connections[type].UI.y() + delta.y);
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
        if (bloq1.itsOver(bloq1Connection.connectorArea, bloq2Connection.connectorArea)) {
            console.log('isover!! ---> ', type);
            if (bloq1Connection.type === bloq2Connection.type) { // if the type is the same --> connect
                console.log('same type!');
                var deltaParent = {
                    x: bloq1Connection.connectorArea.x1 - bloq2Connection.connectorArea.x1,
                    y: bloq1Connection.connectorArea.y1 - bloq2Connection.connectorArea.y1
                };
                var deltaChild = {
                    x: bloq2Connection.connectorArea.x1 - bloq1Connection.connectorArea.x1,
                    y: bloq2Connection.connectorArea.y1 - bloq1Connection.connectorArea.y1
                };
                if (type === 'inputs' || type === 'down') { // parent is bloq1
                    //move bloq
                    utils.moveBloq(bloq2, bloq1.getConnectionPosition(type, bloq2, inputID));
                    bloq2.connections = utils.updateConnectors(bloq2, deltaParent);
                    bloq1.updateBloqs(bloq1, bloq2, utils.oppositeConnection[type], inputID);
                    bloq1Connection.bloq = bloq2;
                    //move bloq's children
                    utils.moveChildren(bloq2, deltaParent);
                } else { //parent is bloq2
                    //move bloq
                    utils.moveBloq(bloq1, bloq2.getConnectionPosition(utils.oppositeConnection[type], bloq1, inputID));
                    bloq1.connections = utils.updateConnectors(bloq1, deltaChild);
                    bloq1.updateBloqs(bloq2, bloq1, type, inputID);
                    bloq2Connection.bloq = bloq1;
                    //move bloq's children
                    utils.moveChildren(bloq1, deltaChild);
                }
                bloq1.delta.lastx = 0;
                bloq1.delta.lasty = 0;
                return true;
            } else { //reject
                utils.rejectBloq(bloq1);
                bloq1.delta.lastx = 0;
                bloq1.delta.lasty = 0;
            }
        } else {
            console.log('not over');
        }
    }
    return false;
};
utils.rejectBloq = function(bloq) {
    "use strict";
    var rejectionLocation = {
        x: 50,
        y: 0
    };
    utils.moveBloq2(bloq, {
        x: rejectionLocation.x,
        y: rejectionLocation.y
    });
};
utils.moveChildren = function(bloq, delta) {
    "use strict";
    for (var i in bloq.relations.children) {
        var child = bloq.relations.children[i].bloq;
        utils.moveBloq2(child, delta);
        if (child.relations !== undefined && child.relations.children !== undefined) {
            utils.moveChildren(child, delta);
        }
    }
};
utils.resizeBloq = function(bloq, delta) {
    "use strict";
    bloq.size.width += delta.x;
    bloq.size.height += delta.y;
    bloq.body.size(bloq.size.width, bloq.size.height);
    bloq.border.size(bloq.size.width, bloq.size.height);
    bloq.selection.size(bloq.size.width, bloq.size.height);
    //update down connector:
    if (bloq.connections.down !== undefined) {
        utils.updateConnector(bloq.connections.down, {
            x: 0,
            y: delta.y
        });
    }
};
utils.moveConnector = function(bloq, connection, delta) {
    //Move connector 
    connection = utils.updateConnector(connection, delta);
    //If there is a bloq connected, move the bloq also
    if (connection.bloq !== undefined) {
        var bloqConnected = connection.bloq;
        utils.moveBloq2(bloqConnected, delta);
    }
    //Update bloq's size
    utils.resizeBloq(bloq, delta);
};
utils.bloqOnTop = function(bloq) {
    bloq.node.parentNode.appendChild(bloq.node);
    var child = {};
    for (var i in bloq.relations.children) {
        child = bloq.relations.children[i].bloq;
        child.node.parentNode.appendChild(child.node);
    }
};
utils.pushElements = function(UIElement, delta) {
    console.log('elements:', UIElement);
    var elements = UIElement.elementsToPush;
    for (var j in elements) {
        elements[j].bloq.x(elements[j].bloq.x() + delta.x);
        elements[j].bloq.y(elements[j].bloq.y() + delta.y);
        var connector = elements[j].connector;
        console.log('connector:', connector);
        if (connector !== undefined) {
            utils.moveConnector(connector.bloq, connector, delta);
        }
    }
};