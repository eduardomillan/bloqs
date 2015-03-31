//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
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
        movedDown: false
    };
    if (posx !== undefined && posy !== undefined) {
        bloq.connections.inputs[index].UI = canvas.group().rect(connectionThreshold * 2, connectionThreshold).attr({
            fill: getRandomColor()
        }).move(posx - connectionThreshold, posy);
    }
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
            bloq.resize({
                x: 0,
                y: connectionThreshold
            });
            bloq.connections.inputs[i].UI = canvas.group().rect(connectionThreshold * 2, connectionThreshold).attr({
                fill: getRandomColor()
            }).move(bloq.x() + bloq.size.width - connectionThreshold, bloq.y() + i * connectionThreshold);
        }
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
            fill: '#FF0000'
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
            fill: '#FF0000'
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
                utils.updateConnector(bloq.connections[type][i], delta);
            }
        } else if (bloq.connections[type]) {
            utils.updateConnector(bloq.connections[type], delta);
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
    "use strict";
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
utils.moveConnector = function(bloq, connection, delta) {
    "use strict";
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
    "use strict";
    bloq.node.parentNode.appendChild(bloq.node);
    var child = {};
    for (var i in bloq.relations.children) {
        child = bloq.relations.children[i].bloq;
        utils.bloqOnTop(child);//.node.parentNode.appendChild(child.node);
    }
};
utils.pushElements = function(bloq, UIElement, delta) {
    "use strict";
    var elements = UIElement.elementsToPush;
    for (var j in elements) {
        elements[j].bloq.x(elements[j].bloq.x() + delta.x);
        elements[j].bloq.y(elements[j].bloq.y() + delta.y);
        var connector = elements[j].connector;
        if (connector !== undefined) {
            utils.moveConnector(bloq, connector, delta);
        }
    }
};
utils.appendUserInput = function(bloq, inputText, type, posx, posy, id) {
    "use strict";
    var text = bloq.foreignObject(100, 100).attr({
        id: 'fobj',
        color: '#FFCC33'
    });
    text.appendChild("input", {
        id: id,
        value: inputText,
        color: '#FFCC33',
    }).move(posx, posy);
    bloq.UIElements.push({
        element: text,
        elementsToPush: undefined
    });
    var code;
    if (type === 'number') {
        code = document.getElementById(id).value;
    } else {
        code = '"' + document.getElementById(id).value + '"';
    }
    bloq.relations.inputChildren[id] = {
        id: id,
        bloq: 'userInput',
        code: code
    };
    utils.addInput(bloq, undefined, undefined, type);
    document.getElementById(id).addEventListener("mousedown", function(e) {
        e.stopPropagation();
    }, false);
    //Check that the input of the user is the one spected
    document.getElementById(id).addEventListener("change", function() {
        if (type === 'number') {
            if (isNaN(parseFloat(document.getElementById(id).value))) {
                //If type is number and input is not a number, remove user input. 
                //ToDo : UX warning!
                document.getElementById(id).value = '';
            } else {
                bloq.relations.inputChildren[id].code = document.getElementById(id).value;
            }
        } else {
            bloq.relations.inputChildren[id].code = '"' + document.getElementById(id).value + '"';
        }
    }, false);
};
utils.appendDropdownInput = function(bloq, dropdownText, type, posx, posy, id) {
    "use strict";
    var dropdown = bloq.foreignObject(100, 100).attr({
        id: id,
        color: '#FFCC33'
    });
    var newList = document.createElement("select");
    for (var i in dropdownText) {
        var newListData = new Option(dropdownText[i].label, dropdownText[i].value);
        //Here we append that text node to our drop down list.
        newList.appendChild(newListData);
    }
    utils.addInput(bloq, undefined, undefined, type);
    //Append the list to dropdown foreignobject:
    dropdown.appendChild(newList).move(posx, posy);
    bloq.UIElements.push({
        element: dropdown,
        elementsToPush: undefined
    });
    bloq.relations.inputChildren[id] = {
        id: id,
        bloq: 'userInput',
        code: newList.value
    };
    newList.onchange = function() {
        bloq.relations.inputChildren[id].code = newList.value;
    }
    document.getElementById(id).addEventListener("mousedown", function(e) {
        e.stopPropagation();
    }, false);
};
utils.paths = {
    // output: 'M256,50 C256,50 12,50 12,50 C9.791,50 8,48.209 8,46 C8,46 8,33 8,33 C3.582,33 0,29.418 0,25 C0,20.582 3.582,17 8,17 C8,17 8,4 8,4 C8,1.791 9.791,0 12,0 C12,0 256,0 256,0 C258.209,0 260,1.791 260,4 C260,4 260,46 260,46 C260,48.209 258.209,50 256,50 Z',
    leftConnector: 'm 36,32 c -4.418,0 -8,-2.582 -8,-7 0,-4.418 3.582,-7 8,-7 l 0,14 z',
    // connector_left: 'M28.000,50.000 C28.000,50.000 4.000,50.000 4.000,50.000 C1.791,50.000 -0.000,48.209 -0.000,46.000 C-0.000,46.000 -0.000,33.000 -0.000,33.000 C4.418,33.000 8.000,29.418 8.000,25.000 C8.000,20.582 4.418,17.000 -0.000,17.000 C-0.000,17.000 -0.000,4.000 -0.000,4.000 C-0.000,1.791 1.791,0.000 4.000,0.000 C4.000,0.000 28.000,0.000 28.000,0.000 C28.000,0.000 28.000,50.000 28.000,50.000 Z'
};
utils.getOutputBloq = function(bloq, posx, width, height) {
    "use strict";
    var group = bloq.group();
    var connector = bloq.path(utils.paths.leftConnector).fill('#cccccc'); //.move(posx, posy);
    connector.x(posx);
    group.add(connector);
    var outputBloq = bloq.rect(width, height).fill('#cccccc').radius(4).move(posx + 8, 0);
    group.add(outputBloq);
    return group;
};
utils.appendBloqInput = function(bloq, inputText, type, posx, posy, inputID) {
    "use strict";
    //draw white (ToDo: UX) rectangle
    var bloqInput = utils.getOutputBloq(bloq, posx, bloq.bloqInput.width, bloq.bloqInput.height);
    utils.addInput(bloq, bloq.x() + posx, bloq.y() + posy, type); //bloq.x()+posx + width, bloq.x()+posy + i * connectionThreshold);
    bloq.UIElements.push({
        element: bloqInput,
        elementsToPush: undefined,
        id: inputID,
        connector: bloq.connections.inputs[bloq.connections.inputs.length - 1]
    });
};
utils.createBloqUI = function(bloq, bloqData) {
    "use strict";
    var margin = 10;
    var posx = margin;
    var width = 0;
    var posy = margin;
    var inputID = 0;
    bloq.UIElements = [{}];
    for (var j in bloqData.text) {
        for (var i in bloqData.text[j]) {
            if (typeof(bloqData.text[j][i]) === typeof({})) {
                if (bloqData.text[j][i].input === 'userInput') {
                    console.log('userinput, id:', inputID);
                    utils.appendUserInput(bloq, bloqData.text[j][i].label, bloqData.text[j][i].type, posx, posy, bloq.node.id + '_' + inputID);
                    inputID += 1;
                    posx += 110;
                } else if (bloqData.text[j][i].input === 'bloqInput') {
                    console.log('bloqinput, id:', inputID);
                    utils.appendBloqInput(bloq, bloqData.text[j][i].label, bloqData.text[j][i].type, posx, posy - margin, inputID);
                    inputID += 1;
                    posx += 110;
                } else if (bloqData.text[j][i].input === 'dropdown') {
                    console.log('dropdown, id:', inputID);
                    utils.appendDropdownInput(bloq, bloqData.text[j][i].data, bloqData.text[j][i].type, posx, posy, bloq.node.id + '_' + inputID);
                    inputID += 1;
                    posx += 110;
                }
            } else {
                var text = bloq.text(bloqData.text[j][i]).font({
                    family: 'Helvetica',
                    fill: '#000',
                    size: 14
                }).move(posx, posy);
                posx += bloqData.text[j][i].length * 5 + 30;
                bloq.UIElements.push({
                    element: text,
                    elementsToPush: undefined
                });
            }
        }
        if (posx > width) {
            width = posx;
        }
        posx = margin;
        posy += 40;
    }
    bloq.UIElements.shift();
    //Add the elements that must be pushed
    for (var i in bloq.UIElements) {
        bloq.UIElements[i].elementsToPush = [{}];
        for (var j in bloq.UIElements) {
            if (j > i) {
                bloq.UIElements[i].elementsToPush.push({
                    bloq: bloq.UIElements[j].element,
                    connector: bloq.UIElements[j].connector
                });
            }
        }
        bloq.UIElements[i].elementsToPush.shift();
    }
    //Update bloq's size
    bloq.resize({
        x: width - bloq.size.width,
        y: posy - bloq.size.height
    });
};
// utils.getBloqPath = function(bloq, bloqData) {
//     "use strict";
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
//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
var newBloq = function(bloqData, canvas, position, data) {
    "use strict";
    var connectionThreshold = 20; // px
    var bloq = canvas.group().move(position[0], position[1]);
    bloq.size = {
        width: 100,
        height: 50
    };
    bloq.delta = {
        x: 0,
        y: 0,
        lastx: 0,
        lasty: 0
    };
    bloq.bloqInput = {
        width: 70,
        height: 50
    };
    bloq.code = bloqData.code;
    if (bloqData.hasOwnProperty('factoryCode')) {
        bloq.factoryCode = bloqData.factoryCode;
    } else {
        bloq.factoryCode = '';
    }
    /**
     * We store relations here, using nodes
     * @type {{parent: undefined, children: Array}}
     */
    bloq.relations = {
        parent: undefined,
        children: [],
        codeChildren: [],
        inputChildren: []
    };
    //Create the connectors using the bloq information
    bloq.connections = utils.createConnectors(bloq, bloqData);
    // basic shape of the bloq
    bloq.body = bloq.rect(bloq.size.width, bloq.size.height).fill(bloqData.color).radius(4);
    // bloq.border = bloq.path(path).fill(bloqData.color).hide(); // give a hidden 'body' to the border path
    // bloq.border.stroke({
    //     color: '#e5a33b',
    //     width: 3
    // });
    bloq.size = {
        width: bloq.bbox().width,
        height: bloq.bbox().height
    };
    bloq.childrenHeight = 0;
    /**
     * Resize a bloq and update its down connector, if any
     * @param bloq
     * @param delta
     */
    bloq.resize = function(delta) {
        "use strict";
        bloq.size.width += delta.x;
        bloq.size.height += delta.y;
        if (bloq.body.children !== undefined) {
            bloq.body.children()[1].size(bloq.size.width, bloq.size.height);
        } else {
            bloq.body.size(bloq.size.width, bloq.size.height);
        }
        // bloq.border.size(bloq.size.width, bloq.size.height);
        // //bloq.selection.size(bloq.size.width, bloq.size.height);
        //update down connector:
        if (bloq.connections.down !== undefined) {
            utils.updateConnector(bloq.connections.down, {
                x: 0,
                y: delta.y
            });
        }
    };
    if (bloqData.hasOwnProperty('text')) {
        utils.createBloqUI(bloq, bloqData);
    }
    /**
     * Set this bloq as draggable
     */
    if (bloq.label !== 'setup' && bloq.label !== 'loop') {
        bloq.draggable();
    }
    /**
     * We start dragging
     */
    bloq.dragmove = function(a) {
        bloq.dragmoveFlag = true;
        // remove parent of this and child in parent:
        if (bloq.relations.parent !== undefined) {
            //move dragged bloq on top
            utils.bloqOnTop(bloq);
            var parentBloq = bloq.getBloqById(bloq.relations.parent);
            if (parentBloq.relations.children[bloq.id()].connection === 'output') {
                for (var k in parentBloq.connections.inputs) {
                    if (parentBloq.connections.inputs[k].inline === true && k === parentBloq.relations.children[bloq.id()].inputID) { //&& bloq.connections[connectionType][k].bloq === undefined) {
                        var delta = {
                            x: -bloq.size.width + parentBloq.bloqInput.width,
                            y: -bloq.size.height + parentBloq.bloqInput.height
                        };
                        parentBloq.resize(delta);
                        delta = {
                            x: -bloq.size.width + parentBloq.bloqInput.width,
                            y: 0
                        };
                        for (var i in parentBloq.UIElements) {
                            if (parentBloq.UIElements[i].id === parseInt(k, 10)) {
                                utils.pushElements(parentBloq, parentBloq.UIElements[i], delta);
                                break;
                            }
                        }
                    }
                }
            }
            parentBloq.deleteChild(bloq);
            bloq.deleteParent(false);
        }
        //Update the deltaX and deltaY movements
        bloq.delta.x = a.x - bloq.delta.lastx;
        bloq.delta.y = a.y - bloq.delta.lasty;
        //Update the lastx and lasty variables
        bloq.delta.lastx = a.x;
        bloq.delta.lasty = a.y;
        //Update the bloq's connectors using the new deltas
        bloq.connections = utils.updateConnectors(bloq, bloq.delta);
        // move child bloqs along with this one
        utils.moveChildren(bloq, bloq.delta);
    };
    /**
     * We stop dragging
     */
    bloq.dragend = function() {
        //Flag used to prevent the execution of these functions when dragend is called after just a click on the bloq!
        if (bloq.dragmoveFlag) {
            //Initialize lasx y laxy
            bloq.delta.lastx = 0;
            bloq.delta.lasty = 0;
            var flag = false;
            var a;
            for (var j in bloq.connections) {
                if (flag === true) {
                    break;
                }
                console.log('Searching connection in bloqs connection:++++++++++++++++++++++++++++++++++', j);
                for (var i in data.bloqs) {
                    if (data.bloqs[i].node.id !== bloq.node.id) {
                        if (j === 'inputs') {
                            for (var k in bloq.connections[j]) {
                                a = utils.manageConnections(j, bloq.connections[j][k], data.bloqs[i].connections[utils.oppositeConnection[j]], bloq, data.bloqs[i], k);
                            }
                        } else if (j === 'output') {
                            for (var h in data.bloqs[i].connections[utils.oppositeConnection[j]]) {
                                a = utils.manageConnections(j, bloq.connections[j], data.bloqs[i].connections[utils.oppositeConnection[j]][h], bloq, data.bloqs[i], h);
                            }
                        } else {
                            a = utils.manageConnections(j, bloq.connections[j], data.bloqs[i].connections[utils.oppositeConnection[j]], bloq, data.bloqs[i]);
                        }
                    }
                }
            }
            console.log('-----------------------------------------------------------------------');
            bloq.dragmoveFlag = false;
        }
    };
    bloq.updateBloqs = function(parent, child, type, inputID) {
        parent.setChildren(child.node.id, type, inputID);
        child.setParent(parent.node.id);
    };
    bloq.itsOver = function(dragRect, staticRect) {
        if (dragRect !== undefined && staticRect !== undefined) {
            // console.log('dragRect.x1 < staticRect.x2 && dragRect.x2 > staticRect.x1 && dragRect.y1 < staticRect.y2 && dragRect.y2 > staticRect.y1', dragRect.x1 < staticRect.x2 && dragRect.x2 > staticRect.x1 && dragRect.y1 < staticRect.y2 && dragRect.y2 > staticRect.y1);
            // console.log('dragRect.x1 < staticRect.x2 && dragRect.x2 > staticRect.x1 && dragRect.y1 < staticRect.y2 && dragRect.y2 > staticRect.y1', dragRect.x1 < staticRect.x2, dragRect.x2 > staticRect.x1, dragRect.y1 < staticRect.y2, dragRect.y2 > staticRect.y1);
            // console.log('dragRect.x1 < staticRect.x2 && dragRect.x2 > staticRect.x1 && dragRect.y1 < staticRect.y2 && dragRect.y2 > staticRect.y1', dragRect.x1, staticRect.x2, dragRect.x2, staticRect.x1, dragRect.y1, staticRect.y2, dragRect.y2, staticRect.y1);
            return dragRect.x1 < staticRect.x2 && dragRect.x2 > staticRect.x1 && dragRect.y1 < staticRect.y2 && dragRect.y2 > staticRect.y1;
        } else {
            return false;
        }
    };
    // utilities
    bloq.deleteParent = function(cascade) {
        if (cascade !== false) {
            var parentBloq = this.getBloqById(this.relations.parent);
            parentBloq.relations.children = [];
        }
        this.relations.parent = undefined;
    };
    bloq.deleteChild = function(child) {
        //remove bloq from connection definition
        if (this.relations.children[child.node.id] !== undefined && this.relations.children[child.node.id].connection === 'output') {
            for (var i in this.connections.inputs) {
                if (this.connections.inputs[i].bloq !== undefined && this.connections.inputs[i].bloq.id() === child.node.id) {
                    this.connections.inputs[i].bloq = undefined;
                    break;
                }
            }
        }
        //remove bloq from children 
        delete bloq.relations.children[child.node.id];
        for (var i in this.relations.codeChildren) {
            if (this.relations.codeChildren[i] === child.node.id) {
                this.relations.codeChildren.splice(i, 1);
                break;
            }
        }
        delete this.relations.inputChildren[child.node.id];
        bloq.getChildrenHeight(true);
    };
    bloq.setChildren = function(childrenId, location, inputID) {
        for (var bloqIndex in bloq.relations.children) {
            if (childrenId == bloq.relations.children[bloqIndex]) {
                // it exists, do nothing
                return false;
            }
        }
        console.log('childrenId', childrenId, data);
        // if we made it so far, add a new child
        bloq.relations.children[childrenId] = {
            bloq: bloq.getBloqById(childrenId),
            connection: location,
            inputID: inputID
        };
        for (bloqIndex in bloq.relations.codeChildren) {
            if (childrenId == bloq.relations.codeChildren[bloqIndex]) {
                // it exists, do nothing
                return false;
            }
        }
        if (location === 'up') {
            bloq.relations.codeChildren.push(childrenId);
        } else {
            bloq.relations.inputChildren[childrenId] = {
                bloq: bloq.getBloqById(childrenId),
                id: inputID
            };
        }
        // bloq.resizeStatementsInput({
        //     x: 0,
        //     y: bloq.childrenHeight
        // });
        bloq.getChildrenHeight(true);
        return true;
    };
    bloq.setParent = function(parentId) {
        bloq.relations.parent = parentId;
        return true;
    };
    bloq.getBloqById = function(nodeId) {
        for (var bloqIndex in data.bloqs) {
            var bloq = data.bloqs[bloqIndex];
            if (bloq.node.id == nodeId) {
                return bloq;
            }
        }
        return null;
    };
    bloq.getCode = function(_function) {
        var code = this.code[_function];
        var search = '';
        var replacement = '';
        var id;
        for (var i in this.relations.inputChildren) {
            id = this.relations.inputChildren[i].id;
            id = id.substr(id.indexOf('_') + 1, id.length);
            search = '{[' + id + ']}';
            if (this.relations.inputChildren[i].bloq === 'userInput' || this.relations.inputChildren[i].bloq === 'dropdown') {
                replacement = this.relations.inputChildren[i].code;
            } else {
                replacement = this.relations.inputChildren[i].bloq.getCode(_function);
            }
            code = code.replace(new RegExp(search, 'g'), replacement);
        }
        for (i = 0; i < this.inputsNumber; i++) {
            search = '{[' + i + ']}';
            code = code.replace(new RegExp(search, 'g'), ' ');
        }
        return code;
    };
    bloq.getChildrenHeight = function(flag) {
        if (flag === true) {
            bloq.childrenHeight = 0;
        }
        var children;
        for (var i in bloq.relations.codeChildren) {
            children = bloq.relations.codeChildren;
            bloq.childrenHeight += bloq.getBloqById(children).size.height;
            if (children.relations !== undefined && children.relations.codeChildren !== undefined) {
                children.getChildrenHeight();
            }
        }
    };
    bloq.on('click', function() {
        // if (this.label.toLowerCase() != 'loop' && this.label.toLowerCase() != 'setup') {
        //     // remove other borders
        //     var canvasChilds = canvas.children();
        //     $.each(canvasChilds, function(index) {
        //         if (canvasChilds[index].hasOwnProperty('border')) {
        //             // hide selection
        //             canvasChilds[index].selection.hide();
        //         }
        //     });
        //     this.selection.show();
        // }
    });
    bloq.resizeStatementsInput = function() {};
    bloq.resizeParents = function(direction) {
        var parentBloq = bloq.getBloqById(bloq.relations.parent);
        console.log('bloq.childrenHeight', bloq.childrenHeight);
        if (bloq.childrenHeight === 0) {
            bloq.childrenHeight += bloq.size.height;
        }
        while (parentBloq.relations !== undefined && parentBloq.relations.parent !== undefined) {
            parentBloq = bloq.getBloqById(parentBloq.relations.parent);
        }
        console.log('going up by : ', bloq.childrenHeight, direction, parentBloq);
        if (direction === 'up') {
            parentBloq.resizeStatementsInput({
                x: 0,
                y: -bloq.childrenHeight
            });
        } else {
            parentBloq.resizeStatementsInput({
                x: 0,
                y: bloq.childrenHeight
            });
        }
    }
    return bloq;
};
//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
var newOutputBloq = function(bloqData, canvas, position, data) {
    "use strict";
    var connectionThreshold = 20; // px
    var bloq = newBloq(bloqData, canvas, position, data); //canvas.group().move(position[0], position[1]);
    //Add the connector to the bloq's UI:
    bloq.body.connector = bloq.path(utils.paths.leftConnector).fill('#cccccc'); //.move(posx, posy);
    bloq.body.connector.x(-8);
    bloq.add(bloq.body.connector);
    bloq.getConnectionPosition = function(connectionType, bloqToConnect, inputID) {
        // connectionType === 'inputs's
        for (var k in bloq.connections[connectionType]) {
            //If the input is inline and there is not a bloq connected still
            if (bloq.connections[connectionType][k].inline === true && k === inputID && bloq.connections[connectionType][k].bloq === undefined) {
                var delta = {
                    x: bloqToConnect.size.width - bloq.bloqInput.width,
                    y: bloqToConnect.size.height - bloq.bloqInput.height
                };
                bloq.resize(delta);
                delta = {
                    x: bloqToConnect.size.width - bloq.bloqInput.width,
                    y: 0
                };
                for (var i in bloq.UIElements) {
                    if (bloq.UIElements[i].id === parseInt(inputID, 10)) {
                        utils.pushElements(bloq, bloq.UIElements[i], delta);
                        break;
                    }
                }
            }
        }
        return bloq.connections[connectionType][inputID].connectionPosition;
    };
    return bloq;
};
//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
var newStatementBloq = function(bloqData, canvas, position, data) {
    "use strict";
    var connectionThreshold = 20; // px
    var bloq = newBloq(bloqData, canvas, position, data);
    bloq.getConnectionPosition = function(connectionType, bloqToConnect, inputID) {
        console.log('getConnectionPosition', connectionType);
        if (connectionType === 'up') {
            return {
                x: bloq.connections[connectionType].connectionPosition.x,
                y: bloq.connections[connectionType].connectionPosition.y - bloqToConnect.size.height
            };
        }
        if (connectionType === 'inputs') {
            for (var k in bloq.connections[connectionType]) {
                //If the input is inline and there is not a bloq connected still
                if (bloq.connections[connectionType][k].inline === true && k === inputID && bloq.connections[connectionType][k].bloq === undefined) {
                    var delta = {
                        x: bloqToConnect.size.width - bloq.bloqInput.width,
                        y: bloqToConnect.size.height - bloq.bloqInput.height
                    };
                    bloq.resize(delta);
                    delta = {
                        x: bloqToConnect.size.width - bloq.bloqInput.width,
                        y: 0
                    };
                    for (var i in bloq.UIElements) {
                        if (bloq.UIElements[i].id === parseInt(inputID, 10)) {
                            utils.pushElements(bloq, bloq.UIElements[i], delta);
                            break;
                        }
                    }
                }
            }
            return bloq.connections[connectionType][inputID].connectionPosition;
        }
        if (connectionType === 'down') {
            bloqToConnect.resizeParents('down');
        }
        return bloq.connections[connectionType].connectionPosition;
    };
    /**
     * We start dragging
     */
    bloq.dragmove = function(a) {
        bloq.dragmoveFlag = true;
        // remove parent of this and child in parent:
        if (bloq.relations.parent !== undefined) {
            //move dragged bloq on top
            utils.bloqOnTop(bloq);
            var parentBloq = bloq.getBloqById(bloq.relations.parent);
            if (parentBloq.relations.children[bloq.id()].connection === 'up') {
                console.log('uuuuuuuuuuuuuuuuuup');
                bloq.resizeParents('up');
            } else if (parentBloq.relations.children[bloq.id()].connection === 'output') {
                for (var k in parentBloq.connections.inputs) {
                    if (parentBloq.connections.inputs[k].inline === true && k === parentBloq.relations.children[bloq.id()].inputID) { //&& bloq.connections[connectionType][k].bloq === undefined) {
                        var delta = {
                            x: -bloq.size.width + parentBloq.bloqInput.width,
                            y: -bloq.size.height + parentBloq.bloqInput.height
                        };
                        parentBloq.resize(delta);
                        delta = {
                            x: -bloq.size.width + parentBloq.bloqInput.width,
                            y: 0
                        };
                        for (var i in parentBloq.UIElements) {
                            if (parentBloq.UIElements[i].id === parseInt(k, 10)) {
                                utils.pushElements(parentBloq, parentBloq.UIElements[i], delta);
                                break;
                            }
                        }
                    }
                }
            }
            parentBloq.deleteChild(bloq);
            bloq.deleteParent(false);
        }
        //Update the deltaX and deltaY movements
        bloq.delta.x = a.x - bloq.delta.lastx;
        bloq.delta.y = a.y - bloq.delta.lasty;
        //Update the lastx and lasty variables
        bloq.delta.lastx = a.x;
        bloq.delta.lasty = a.y;
        //Update the bloq's connectors using the new deltas
        bloq.connections = utils.updateConnectors(bloq, bloq.delta);
        // move child bloqs along with this one
        utils.moveChildren(bloq, bloq.delta);
    };
    return bloq;
};
//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
var newProjectBloq = function(bloqData, canvas, position, data) {
    "use strict";
    var connectionThreshold = 20; // px
    var bloq = newBloq(bloqData, canvas, position, data);
    //Down connector x position : +20 px
    utils.updateConnector(bloq.connections.down, {
        x: 20,
        y: 0
    });
    //Add bloq's left and down UI parts
    bloq.body.leftPart = bloq.rect(20, 60).fill(bloqData.color).radius(4);
    bloq.body.leftPart.size.width = 20;
    bloq.body.leftPart.size.height = 60;
    bloq.add(bloq.body.leftPart);
    bloq.body.downPart = bloq.rect(bloq.size.width, 20).fill(bloqData.color).radius(4);
    bloq.body.downPart.y(60 - 5);
    bloq.add(bloq.body.downPart);
    //Define bloqlabel and add the label on the bloq
    bloq.label = bloqData.label;
    bloq.text(bloqData.label.toUpperCase()).font({
        family: 'Helvetica',
        fill: '#fff',
        size: 14
    }).move(20, 5);
    /**
     * Resize a statements input bloq
     * @param delta
     */
    bloq.resizeStatementsInput = function(delta) {
        "use strict";
        bloq.body.leftPart.size.height += delta.y;
        console.log('resizeStatementsInput', bloq.body.leftPart.size.height);
        console.log('resizeStatementsInput-->', bloq.body.leftPart.height());
        bloq.body.leftPart.height( bloq.body.leftPart.size.height );
        console.log('resizeStatementsInput-->', bloq.body.leftPart.height());
        bloq.body.downPart.move(0, bloq.body.downPart.y() + delta.y);
    };
    // bloq.resize = bloq.resizeStatementsInput;
    bloq.getConnectionPosition = function(connectionType, bloqToConnect, inputID) {
        // bloqToConnect.getChildrenHeight(true);
        // bloqToConnect.childrenHeight+=bloqToConnect.size.height;
        // console.log('bloqToConnect', bloqToConnect.childrenHeight);
        // bloq.resizeStatementsInput({x:0,y:bloqToConnect.childrenHeight});

        bloqToConnect.resizeParents('down');

        return {
            x: bloq.connections[connectionType].connectionPosition.x,
            y: bloq.connections[connectionType].connectionPosition.y
        };
    };
    return bloq;
};
/**
 * Created by jesus on 30/03/15.
 */

var getBasicBloqs = function(){

    var data = {
        setup: {
            label: 'setup',
            down: true,
            color: '#000',
            code: {setup: "", loop: "void setup (){\n"}
        }//,
        // loop: {
        //     label: 'loop',
        //     down: true,
        //     color: '#000',
        //     code: {setup: "", loop: "void loop (){\n"}
        // },
        // horizontal3Inputs: {
        //     up: true,
        //     down: true,
        //     path: '',
        //     color: '#e2e2e2',
        //     text : [ ["int:", {input : 'bloqInput',type:"int",label:"INPUT"}, "number:", {input : 'bloqInput',type:"int",label:"INPUT"}, "userInput", {input:'userInput', type:"string",label:"userInput"}] ] ,
        //     code: {setup:"trial({0},{1},{2});\n", loop:"trial({0},{1},{2});\n"}
        // },
        // basicInputDropdown: {
        //     output: 'int',
        //     color: '#e2e2e2',
        //     text:[[{input:'dropdown', type:"text",data:[{label:'ON',value:'HIGH'},{label:'OFF',value:'LOW'}]}]],
        //     code: {setup:"{0}", loop:"{0}"}
        // },
        // basicInputNumber: {
        //     output: 'int',
        //     color: '#e2e2e2',
        //     text:[["number",{input:'userInput', type:"number",label:"number"}]],
        //     code: {setup:'{0}', loop:'{0}'}
        // }
    };
    return data;


};

(function(root, undefined) {
    "use strict";
    var data = {
        bloqs: [],
        code: {
            setup: '',
            loop: ''
        }
    };
    var field = {};
    var canvas = {};
    data.createCanvas = function(element) {
        if ($.isEmptyObject(canvas)) {
            field = SVG(element).size('100%', '100%');
            canvas = field.group().attr('class', 'bloqs-canvas');
        }
        return canvas;
    };
    data.bloqsToCode = function() {
        data.functionCode(data.bloqs.setup, 'setup');
        data.functionCode(data.bloqs.loop, 'loop');
        return data.code.setup + data.code.loop;
    };
    data.functionCode = function(bloq, _function) {
        if (bloq === data.bloqs.loop || bloq === data.bloqs.setup) {
            data.code[_function] = bloq.code.loop;
        } else {
            data.code[_function] += '   ' + bloq.getCode(_function);
        }
        if (bloq.relations.codeChildren.length > 0) {
            data.functionCode(bloq.getBloqById(bloq.relations.codeChildren), _function);
        } else {
            data.code[_function] += '\n}\n';
        }
    };
    /**
     * Create a bloq and setup its properties and events.
     *
     * @param bloqData bloq object
     * @param canvas element to create the bloq into
     * @param position x,y position (just useful for the demo version)
     *
     * @returns Object bloq
     */
    data.createBloq = function(bloqData, canvas, position) {
        var bloq;
        if (bloqData.hasOwnProperty('output')) {
            bloq = newOutputBloq(bloqData, canvas, position, data);
        } else {
            bloq = newStatementBloq(bloqData, canvas, position, data);
        }
        data.bloqs.push(bloq);
        if (bloqData.label === 'loop') {
            data.bloqs.loop = bloq;
        } else if (bloqData.label === 'setup') {
            data.bloqs.setup = bloq;
        }
        return bloq;
    };
    /**
     * Create a set of bloqs and setup its properties and events.
     *
     * @param path path to the set of JSON files defining the bloqs
     *
     * @returns array of Object bloq
     */
    data.createProjectStructure = function() {
        var bloqTypes = getBasicBloqs();
        var counter = 100;
        for (var i in bloqTypes) {
            data.bloqs[i] = newProjectBloq(bloqTypes[i], canvas, [100, counter], data);
            counter += 100;
        }
    };
    // Base function.
    var bloqs = function() {
        return data;
    };
    // Export to the root, which is probably `window`.
    root.bloqs = bloqs;
}(this));