var utils = utils || {};
var connectionThreshold = 20; // px

/**
 * Data schema that represents the opposite locations used to match connections
 * @type {{inputs: string, output: string, up: string, down: string}}
 */
utils.oppositeConnection = {
    inputs: 'output',
    output: 'inputs',
    up: 'down',
    down: 'up'
};

/**
 * Moves bloq to a set of coordinates
 * @param bloq
 * @param location
 */
utils.moveBloq = function (bloq, location) {
    "use strict";
    bloq.x(location.x);
    bloq.y(location.y);
};

/**
 * Move bloq to a delta location and update its connections
 * @param bloq
 * @param delta
 */
utils.moveBloq2 = function (bloq, delta) {
    "use strict";
    bloq.x(bloq.x() + delta.x);
    bloq.y(bloq.y() + delta.y);
    bloq.connections = utils.updateConnectors(bloq, delta);
};

/**
 * Get a random hex color code
 * @returns {string}
 */
utils.getRandomColor = function () {
    "use strict";
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

/**
 * Append an input to a bloq
 * @param bloq
 * @param posx
 * @param posy
 * @param type
 */
utils.addInput = function (bloq, posx, posy, type) {
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
            fill: utils.getRandomColor()
        }).move(posx - connectionThreshold, posy)
    };
    bloq.inputsNumber = bloq.connections.inputs.length;
};

/**
 * Create connection locations based on json data
 * @param bloq
 * @param bloqData
 * @returns {*|connections|Array}
 */
utils.createConnectors = function (bloq, bloqData) {
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
                fill: utils.getRandomColor()
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
 * Updates the position of the connectors of a bloq (used after modifying the bloq's position)
 * @param bloq
 * @param delta
 */
utils.updateConnectors = function (bloq, delta) {
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

/**
 * Update connector locations
 * @param connector
 * @param delta
 * @returns connector
 */
utils.updateConnector = function (connector, delta) {
    "use strict";
    connector.connectionPosition.x += delta.x;
    connector.connectionPosition.y += delta.y;
    connector.connectorArea.x1 += delta.x;
    connector.connectorArea.x2 += delta.x;
    connector.connectorArea.y1 += delta.y;
    connector.connectorArea.y2 += delta.y;
    connector.UI.move(connector.UI.x() + delta.x, connector.UI.y() + delta.y);
    return connector;
};

/**
 * Match connectors between 2 bloqs
 * @param type
 * @param bloq1Connection
 * @param bloq2Connection
 * @param bloq1
 * @param bloq2
 * @param inputID
 * @returns {boolean}
 */
utils.manageConnections = function (type, bloq1Connection, bloq2Connection, bloq1, bloq2, inputID) {
    "use strict";
    if (bloq2Connection !== undefined && bloq1Connection !== undefined) {
        if (bloq1.itsOver(bloq1Connection.connectorArea, bloq2Connection.connectorArea)) {
            if (bloq1Connection.type === bloq2Connection.type) { // if the type is the same --> connect
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
        }
    }
    return false;
};

/**
 * Reject bloq
 * @param bloq
 */
utils.rejectBloq = function (bloq) {
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

/**
 * Moves children along a bloq
 * @param bloq
 * @param delta
 */
utils.moveChildren = function (bloq, delta) {
    "use strict";
    for (var i in bloq.relations.children) {
        var child = bloq.relations.children[i].bloq;
        utils.moveBloq2(child, delta);
        if (child.relations !== undefined && child.relations.children !== undefined) {
            utils.moveChildren(child, delta);
        }
    }
};

/**
 * Resize a bloq and update its down connector, if any
 * @param bloq
 * @param delta
 */
utils.resizeBloq = function (bloq, delta) {
    "use strict";
    /*bloq.size.width += delta.x;
    bloq.size.height += delta.y;
    //bloq.body.size(bloq.size.width, bloq.size.height);
    bloq.border.size(bloq.size.width, bloq.size.height);
    //bloq.selection.size(bloq.size.width, bloq.size.height);
    console.log(bloq.bbox().width);
    console.log(bloq.bbox().height);*/
    //update down connector:
    if (bloq.connections.down !== undefined) {
        utils.updateConnector(bloq.connections.down, {
            x: 0,
            y: delta.y
        });
    }
};

/**
 * Move connector
 * @param bloq
 * @param connection
 * @param delta
 */
utils.moveConnector = function (bloq, connection, delta) {
    "use strict";
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

/**
 * Put bloq on top
 * @param bloq
 */
utils.bloqOnTop = function (bloq) {
    "use strict";
    bloq.node.parentNode.appendChild(bloq.node);
    var child = {};
    for (var i in bloq.relations.children) {
        child = bloq.relations.children[i].bloq;
        child.node.parentNode.appendChild(child.node);
    }
};

/**
 * Push elements
 * @param bloq
 * @param UIElement
 * @param delta
 */
utils.pushElements = function (bloq, UIElement, delta) {
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

/**
 * Append a text input to a bloq
 * @param bloq
 * @param inputText
 * @param type
 * @param posx
 * @param posy
 * @param id
 */
utils.appendUserInput = function (bloq, inputText, type, posx, posy, id) {
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
    document.getElementById(id).addEventListener("mousedown", function (e) {
        e.stopPropagation();
    }, false);
    //Check that the input of the user is the one spected
    document.getElementById(id).addEventListener("change", function () {
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

/**
 * Append a dropdown to a bloq
 * @param bloq
 * @param dropdown_text
 * @param type
 * @param posx
 * @param posy
 * @param id
 */
utils.appendDropdownInput = function (bloq, dropdown_text, type, posx, posy, id) {
    var dropdown = bloq.foreignObject(100, 100).attr({
        id: id,
        color: '#FFCC33'
    });
    var newList = document.createElement("select");
    for (var i in dropdown_text) {
        var newListData = new Option(dropdown_text[i].label, dropdown_text[i].value);
        //Here we append that text node to our drop down list.
        newList.appendChild(newListData);
    }
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
    newList.onchange = function () {
        bloq.relations.inputChildren[id].code = newList.value;
    }
};

/**
 * Append bloq input
 * @param bloq
 * @param inputText
 * @param type
 * @param posx
 * @param posy
 */
utils.appendBloqInput = function (bloq, inputText, type, posx, posy) {
    //draw white (ToDo: UX) rectangle
    var bloqInput = bloq.rect(bloq.bloqInput.width, bloq.bloqInput.height).attr({
        fill: '#fff'
    }).move(posx, posy);
    utils.addInput(bloq, bloq.x() + posx, bloq.y() + posy, type); //bloq.x()+posx + width, bloq.x()+posy + i * connectionThreshold);
    bloq.UIElements.push({
        element: bloqInput,
        elementsToPush: undefined,
        id: bloq.connections.inputs.length - 1,
        connector: bloq.connections.inputs[bloq.connections.inputs.length - 1]
    });
};

/**
 * Create bloq interface
 * @param bloq
 * @param bloqData
 */
utils.createBloqUI = function (bloq, bloqData) {
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
                    utils.appendUserInput(bloq, bloqData.text[j][i].label, bloqData.text[j][i].type, posx, posy, inputID);
                    inputID += 1;
                    posx += 110;
                } else if (bloqData.text[j][i].input === 'bloqInput') {
                    utils.appendBloqInput(bloq, bloqData.text[j][i].label, bloqData.text[j][i].type, posx, posy);
                    inputID += 1;
                    posx += 110;
                } else if (bloqData.text[j][i].input === 'dropdown') {
                    utils.appendDropdownInput(bloq, bloqData.text[j][i].data, bloqData.text[j][i].type, posx, posy, inputID)
                    inputID += 1;
                    posx += 110;
                }
            } else {
                var text = bloq.text(bloqData.text[j][i]).font({
                    family: 'Helvetica',
                    fill: '#fff',
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
        posy += 50;
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
    utils.resizeBloq(bloq, {
        x: Math.abs(bloq.size.width - width),
        y: Math.abs(bloq.size.height - posy)
    });
};

utils.getBloqPath = function(bloq, bloqData){
    var path = "m 0,8 A 8,8 0 0,1 8,0 H 15 l 6,4 3,0 6,-4 H 217.11582946777344 v 5 c 0,10 -8,-8 -8,7.5 s 8,-2.5 8,7.5 v 60 v 25 H 30 l -6,4 -3,0 -6,-4 H 8 a 8,8 0 0,1 -8,-8 z";
    if(bloqData.down){
        // if it has a down connection, it has to have an up one
        // lets see if it has inputs
        if(bloqData.hasOwnProperty('inputs') && bloqData.inputs.length > 0){
            // deal with the inputs
        } else {
            // this bloq has no inputs, only top and down
        }
        // deal with inner bottoms
        // deal with inner inputs
    } else if ((!bloqData.hasOwnProperty('down') || bloqData.down == false) && (!bloqData.hasOwnProperty('up') || bloqData.up == false)){
        // bloq without up or down connections
        // this means that we have at least an output
        if(bloqData.hasOwnProperty('inputs') && bloqData.inputs.length > 0){
            // deal with the inputs
            path = 'm 0,0 H 88.04196166992188 v 5 c 0,10 -8,-8 -8,7.5 s 8,-2.5 8,7.5 v 5 H 0 V 20 c 0,-10 -8,8 -8,-7.5 s 8,2.5 8,-7.5 z';
        } else {
            // this bloq has no inputs
            // absolute coordinates for path
            path = 'M256,50 C256,50 12,50 12,50 C9.791,50 8,48.209 8,46 C8,46 8,33 8,33 C3.582,33 0,29.418 0,25 C0,20.582 3.582,17 8,17 C8,17 8,4 8,4 C8,1.791 9.791,0 12,0 C12,0 256,0 256,0 C258.209,0 260,1.791 260,4 C260,4 260,46 260,46 C260,48.209 258.209,50 256,50 Z';
        }
    } else if (bloqData.up && !bloqData.hasOwnProperty('down')){
        // bloq with only top
    }
    return path;
};

var bloqsNamespace = bloqsNamespace || {};

/**
 * Create a new bloq in a canvas
 * @param bloqData
 * @param canvas
 * @param position
 * @param data
 * @returns {*|void}
 */
bloqsNamespace.newBloq = function (bloqData, canvas, position, data) {
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
        height: 30
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
    /**
     * Set this bloq as draggable
     */
    if (bloq.label !== 'setup' && bloq.label !== 'loop') {
        bloq.draggable();
    }

    // basic path (shape) for bloq
    var path = utils.getBloqPath(bloq, bloqData);
    bloq.body = bloq.path(path).fill(bloqData.color);
    bloq.border = bloq.path(path).fill(bloqData.color).hide(); // give a hidden 'body' to the border path
    bloq.border.stroke({ color: '#e5a33b', width: 3 });

    bloq.size = {
        width: bloq.bbox().width,
        height: bloq.bbox().height
    };
    /*bloq.selection = bloq.rect(bloq.size.width, bloq.size.height).fill('none').stroke({
        width: 3,
        color: '#FFCC33'
    }).radius(10).hide();*/

    //Create the connectors using the bloq information
    bloq.connections = utils.createConnectors(bloq, bloqData);
    if (bloqData.hasOwnProperty('label') && bloqData.label !== '') {
        bloq.label = bloqData.label;
        bloq.text(bloqData.label.toUpperCase()).font({
            family: 'Helvetica',
            fill: '#fff',
            size: 14
        }).move(10, 5);
    } else {
        bloq.label = '';
    }
    if (bloqData.hasOwnProperty('text')) {
        utils.createBloqUI(bloq, bloqData);
    }
    bloq.getConnectionPosition = function (connectionType, bloqToConnect, inputID) {
        if (connectionType === 'up') {
            return {
                x: bloq.connections[connectionType].connectionPosition.x,
                y: bloq.connections[connectionType].connectionPosition.y - bloqToConnect.size.height
            };
        }
        if (connectionType === 'output') {
            return {
                x: bloq.connections[connectionType].connectionPosition.x - bloqToConnect.size.width,
                y: bloq.connections[connectionType].connectionPosition.y - inputID * connectionThreshold
            };
        }
        if (connectionType === 'inputs') {
            console.log('--------------------------------------------------> MOVING DOWN');
            for (var k in bloq.connections[connectionType]) {
                //If the input is inline and there is not a bloq connected still
                if (bloq.connections[connectionType][k].inline === true && k === inputID && bloq.connections[connectionType][k].bloq === undefined) {
                    var delta = {
                        x: bloqToConnect.size.width - bloq.bloqInput.width,
                        y: bloqToConnect.size.height - bloq.bloqInput.height
                    };
                    utils.resizeBloq(bloq, delta);
                    delta = {
                        x: bloqToConnect.size.width - bloq.bloqInput.width,
                        y: 0
                    };
                    for (var i in bloq.UIElements) {
                        if (bloq.UIElements[i].id === parseInt(inputID, 10)) {
                            console.log('here pushing', bloq.UIElements[i].elementsToPush);
                            utils.pushElements(bloq, bloq.UIElements[i], delta);
                            break;
                        }
                    }
                }
                if (k > inputID) {
                    if (bloq.connections[connectionType][k].inline === false && bloq.connections[connectionType][k].movedDown === false) {
                        utils.moveConnector(bloq, bloq.connections[connectionType][k], {
                            x: 0,
                            y: bloqToConnect.size.height - k * connectionThreshold
                        });
                        //The connector has already been moved down once
                        bloq.connections[connectionType][k].movedDown = true;
                        bloq.connections[connectionType][k].movedUp = false;
                    }
                }
            }
            return bloq.connections[connectionType][inputID].connectionPosition;
        }
        return bloq.connections[connectionType].connectionPosition;
    };
    /**
     * We start dragging
     */
    bloq.dragmove = function (a) {
        bloq.dragmoveFlag = true;
        // remove parent of this and child in parent:
        if (bloq.relations.parent !== undefined) {
            //move dragged bloq on top
            utils.bloqOnTop(bloq);
            var parentBloq = bloq.getBloqById(bloq.relations.parent);
            if (parentBloq.relations.children[bloq.id()].connection === 'output') {
                console.log('--------------------------------------------------> MOVING UP');
                for (var k in parentBloq.connections.inputs) {
                    if (parentBloq.connections.inputs[k].inline === true && k === parentBloq.relations.children[bloq.id()].inputID) { //&& bloq.connections[connectionType][k].bloq === undefined) {
                        var delta = {
                            x: -bloq.size.width + parentBloq.bloqInput.width,
                            y: -bloq.size.height + parentBloq.bloqInput.height
                        };
                        // var delta = {
                        //     x: -bloq.size.width + bloq.bloqInput.width,
                        //     y: -parentBloq.size.height + bloq.bloqInput.height
                        // };
                        utils.resizeBloq(parentBloq, delta);
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
                    if (k > parentBloq.relations.children[bloq.id()].inputID && parentBloq.connections.inputs[k].movedUp === false) {
                        utils.moveConnector(parentBloq, parentBloq.connections.inputs[k], {
                            x: 0,
                            y: -bloq.size.height + k * connectionThreshold
                        });
                        //The connector has already been moved up once
                        parentBloq.connections.inputs[k].movedUp = true;
                        parentBloq.connections.inputs[k].movedDown = false;
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
    bloq.dragend = function () {
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
                                // if (a === true) {
                                //     flag = true;
                                //     break;
                                // }
                            }
                        } else if (j === 'output') {
                            for (var h in data.bloqs[i].connections[utils.oppositeConnection[j]]) {
                                a = utils.manageConnections(j, bloq.connections[j], data.bloqs[i].connections[utils.oppositeConnection[j]][h], bloq, data.bloqs[i], h);
                                // if (a === true) {
                                //     flag = true;
                                //     break;
                                // }
                            }
                        } else {
                            a = utils.manageConnections(j, bloq.connections[j], data.bloqs[i].connections[utils.oppositeConnection[j]], bloq, data.bloqs[i]);
                        }
                        // if (a === true) {
                        //     flag = true;
                        //     break;
                        // }
                    }
                }
            }
            console.log('-----------------------------------------------------------------------');
            bloq.dragmoveFlag = false;
        }
    };
    bloq.updateBloqs = function (parent, child, type, inputID) {
        parent.setChildren(child.node.id, type, inputID);
        child.setParent(parent.node.id);
    };
    bloq.itsOver = function (dragRect, staticRect) {
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
    bloq.deleteParent = function (cascade) {
        if (cascade !== false) {
            var parentBloq = this.getBloqById(this.relations.parent);
            parentBloq.relations.children = [];
        }
        this.relations.parent = undefined;
    };
    bloq.deleteChild = function (child) {
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
        // for (i in this.relations.inputChildren) {
        //     if (this.relations.inputChildren[i] === child.node.id) {
        //         this.relations.inputChildren.splice(i, 1);
        //         break;
        //     }
        // }
    };
    bloq.setChildren = function (childrenId, location, inputID) {
        for (var bloqIndex in bloq.relations.children) {
            if (childrenId == bloq.relations.children[bloqIndex]) {
                // it exists, do nothing
                return false;
            }
        }
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
            console.log('bloq.relations.inputChildren', bloq.relations.inputChildren, childrenId);
            bloq.relations.inputChildren[childrenId] = {
                bloq: bloq.getBloqById(childrenId),
                id: inputID
            };
        }
        console.log('setChildren', bloq.relations.codeChildren);
        return true;
    };
    bloq.setParent = function (parentId) {
        bloq.relations.parent = parentId;
        return true;
    };
    bloq.getBloqById = function (nodeId) {
        for (var bloqIndex in data.bloqs) {
            var bloq = data.bloqs[bloqIndex];
            if (bloq.node.id == nodeId) {
                return bloq;
            }
        }
        return null;
    };
    bloq.getCode = function (_function) {
        var code = this.code[_function];
        var search = '';
        var replacement = '';
        for (var i in this.relations.inputChildren) {
            console.log('getcode:', this.relations.inputChildren[i]);
            search = '{[' + this.relations.inputChildren[i].id + ']}';
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
    bloq.on('click', function () {
        if (this.label.toLowerCase() != 'loop' && this.label.toLowerCase() != 'setup') {
            // remove other borders
            var canvasChilds = canvas.children();
            $.each(canvasChilds, function (index) {
                if (canvasChilds[index].hasOwnProperty('border')) {
                    // hide selection
                    //canvasChilds[index].selection.hide();
                }
            });
            //this.selection.show();
        }
    });
    return bloq;
};
(function (root, undefined) {
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
    data.createCanvas = function (element) {
        if ($.isEmptyObject(canvas)) {
            field = SVG(element).size('100%', '100%');
            canvas = field.group().attr('class', 'bloqs-canvas');
        }
        return canvas;
    };
    data.bloqsToCode = function () {
        data.functionCode(data.bloqs.setup, 'setup');
        data.functionCode(data.bloqs.loop, 'loop');
        return data.code.setup + data.code.loop;
    };
    data.functionCode = function (bloq, _function) {
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
    data.createBloq = function (bloqData, canvas, position) {
        var bloq = bloqsNamespace.newBloq(bloqData, canvas, position, data);
        data.bloqs.push(bloq);
        if (bloq.label === 'loop') {
            data.bloqs.loop = bloq;
        } else if (bloq.label === 'setup') {
            data.bloqs.setup = bloq;
        }
        return bloq;
    };
    // Base function.
    var bloqs = function () {
        return data;
    };
    // Export to the root, which is probably `window`.
    root.bloqs = bloqs;
}(this));