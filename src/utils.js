"use strict";
//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
var utils = utils || {};
var connectionThreshold = 20; // px
utils.moveBloq = function(bloq, location) {
    bloq.x(location.x);
    bloq.y(location.y);
};
utils.moveBloq2 = function(bloq, delta) {
    bloq.x(bloq.x() + delta.x);
    bloq.y(bloq.y() + delta.y);
    bloq.connections = utils.updateConnectors(bloq, delta);
};

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Updates de position of the connectors of a bloq (used after modifying the bloq's position)
 * @param bloq
 */
utils.updateConnectors = function(bloq, delta) {
    for (var type in bloq.connections) {
        if (bloq.connections[type] && type === 'inputs') {
            for (var i in bloq.connections[type]) {
                utils.updateConnector(bloq.connections[type][i], delta);
            }
        } else if (bloq.connections[type]) {
            utils.updateConnector(bloq.connections[type], delta);
        }
    }
    return bloq.connections;
};
utils.updateConnector = function(connector, delta) {
    connector.connectionPosition.x += delta.x;
    connector.connectionPosition.y += delta.y;
    connector.connectorArea.x1 += delta.x;
    connector.connectorArea.x2 += delta.x;
    connector.connectorArea.y1 += delta.y;
    connector.connectorArea.y2 += delta.y;
    if (connector.UI !== undefined) {
        connector.UI.move(connector.UI.x() + delta.x, connector.UI.y() + delta.y);
    }
    return connector;
};
utils.oppositeConnection = {
    inputs: 'output',
    output: 'inputs',
    up: 'down',
    down: 'up'
};
utils.manageConnections = function(type, bloq1Connection, bloq2Connection, bloq1, bloq2, inputID) {
    if (bloq2Connection !== undefined && bloq1Connection !== undefined) {
        if (bloq1.itsOver(bloq1Connection.connectorArea, bloq2Connection.connectorArea)) {
            if (bloq1Connection.type === bloq2Connection.type) { // if the type is the same --> connect
                console.log('here');
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
                    bloq1.updateBloqs(bloq1, bloq2, utils.oppositeConnection[type], inputID);
                    utils.moveBloq(bloq2, bloq1.getConnectionPosition(type, bloq2, inputID));
                    bloq2.connections = utils.updateConnectors(bloq2, deltaParent);
                    bloq1Connection.bloq = bloq2;
                    //move bloq's children
                    utils.moveChildren(bloq2, deltaParent);
                    //put child bloq on top if it is not already: 
                    utils.bloqOnTop(bloq2);
                } else { //parent is bloq2
                    //move bloq
                    bloq1.updateBloqs(bloq2, bloq1, type, inputID);
                    utils.moveBloq(bloq1, bloq2.getConnectionPosition(utils.oppositeConnection[type], bloq1, inputID));
                    bloq1.connections = utils.updateConnectors(bloq1, deltaChild);
                    bloq2Connection.bloq = bloq1;
                    //move bloq's children
                    utils.moveChildren(bloq1, deltaChild);
                    //put child bloq on top if it is not already: 
                    utils.bloqOnTop(bloq1);
                }
                bloq1.delta.lastx = 0;
                bloq1.delta.lasty = 0;
                return true;
            } else { //reject
                utils.rejectBloq(bloq1);
                bloq1.delta.lastx = 0;
                bloq1.delta.lasty = 0;
            }
        } else {}
    }
    return false;
};
utils.rejectBloq = function(bloq) {
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
    for (var i in bloq.relations.children) {
        var child = bloq.relations.children[i].bloq;
        utils.moveBloq2(child, delta);
        if (child.relations !== undefined && child.relations.children !== undefined) {
            utils.moveChildren(child, delta);
        }
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
    bloq.resize(delta);
};
utils.bloqOnTop = function(bloq) {
    bloq.node.parentNode.appendChild(bloq.node);
    var child = {};
    for (var i in bloq.relations.children) {
        child = bloq.relations.children[i].bloq;
        utils.bloqOnTop(child); //.node.parentNode.appendChild(child.node);
    }
};
utils.getOutputBloq = function(bloq, posx, width, height) {
    var path = 'm 36,32 c -4.418,0 -8,-2.582 -8,-7 0,-4.418 3.582,-7 8,-7 l 0,14 z';
    var group = bloq.group();
    var connector = bloq.path(path).fill('#cccccc'); //.move(posx, posy);
    connector.x(posx);
    group.add(connector);
    var outputBloq = bloq.rect(width, height).fill('#cccccc').radius(4).move(posx + 8, 0);
    group.add(outputBloq);
    return group;
};
// utils.getBloqPath = function(bloq, bloqData) {
//     
//     var path = "m 0,8 A 8,8 0 0,1 8,0 H 15 l 6,4 3,0 6,-4 H 217.11582946777344 v 5 c 0,10 -8,-8 -8,7.5 s 8,-2.5 8,7.5 v 60 v 25 H 30 l -6,4 -3,0 -6,-4 H 8 a 8,8 0 0,1 -8,-8 z";
//     if (bloqData.down) {
//         // if it has a down connection, it has to have an up one
//         // lets see if it has inputs
//         if (bloqData.hasOwnProperty('inputs') && bloqData.inputs.length > 0) {
//             // deal with the inputs
//         } else {
//             // this bloq has no inputs, only top and down
//             path = 'M4.000,0.000 C4.000,0.000 321.000,0.000 321.000,0.000 C323.209,0.000 325.000,1.791 325.000,4.000 C325.000,4.000 325.000,46.000 325.000,46.000 C325.000,48.209 323.209,50.000 321.000,50.000 C321.000,50.000 4.000,50.000 4.000,50.000 C1.791,50.000 -0.000,48.209 -0.000,46.000 C-0.000,46.000 -0.000,4.000 -0.000,4.000 C-0.000,1.791 1.791,0.000 4.000,0.000 Z';
//         }
//         // deal with inner bottoms
//         // deal with inner inputs
//     } else if ((!bloqData.hasOwnProperty('down') || bloqData.down === false) && (!bloqData.hasOwnProperty('up') || bloqData.up === false)) {
//         // bloq without up or down connections
//         // this means that we have at least an output
//         if (bloqData.hasOwnProperty('inputs') && bloqData.inputs.length > 0) {
//             // deal with the inputs
//             path = 'm 0,0 H 88.04196166992188 v 5 c 0,10 -8,-8 -8,7.5 s 8,-2.5 8,7.5 v 5 H 0 V 20 c 0,-10 -8,8 -8,-7.5 s 8,2.5 8,-7.5 z';
//         } else {
//             // this bloq has no inputs
//             // absolute coordinates for path
//             utils.getOutputBloq(bloq, 0, bloq.size.width, bloq.size.height);
//             // path = 'M256,50 C256,50 12,50 12,50 C9.791,50 8,48.209 8,46 C8,46 8,33 8,33 C3.582,33 0,29.418 0,25 C0,20.582 3.582,17 8,17 C8,17 8,4 8,4 C8,1.791 9.791,0 12,0 C12,0 256,0 256,0 C258.209,0 260,1.791 260,4 C260,4 260,46 260,46 C260,48.209 258.209,50 256,50 Z';
//         }
//     } else if (bloqData.up && !bloqData.hasOwnProperty('down')) {
//         // bloq with only top
//     }
//     return path;
// };