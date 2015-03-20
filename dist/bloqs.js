var utils = utils || {};
/**
 * Takes 2 bloqs and connects them
 * @param bloq1
 * @param bloq2
 * @param location
 */
// utils.connectBloqs = function(bloq1, bloq2, location) {
//     var parent = bloq1;
//     var child = bloq2;
//     if (typeof(location) === typeof({})) {
//         bloq2.x(location.x1);
//         bloq2.y(location.y1);
//     } else {
//         var newLocation = 'up';
//         if (location === 'up') {
//             bloq2.x(bloq1.x());
//             bloq2.y(bloq1.y() + bloq1.first().height());
//         } else if (location === 'down') {
//             bloq2.x(bloq1.x());
//             bloq2.y(bloq1.y() - bloq1.first().height());
//             parent = bloq2;
//             child = bloq1;
//         } else if (location === 'inputs') {
//             bloq2.x(bloq1.x() - bloq1.first().width());
//             bloq2.y(bloq1.y());
//             parent = bloq2;
//             child = bloq1;
//             newLocation = 'output';
//         } else if (location.indexOf('output') >= 0) {
//             var i = parseInt(location.replace('output', ''), 10);
//             bloq2.x(bloq1.x() + bloq1.first().width());
//             bloq2.y(bloq1.y() + (i - 1));
//             newLocation = location;
//         }
//         child.location = newLocation;
//         if (child.relations.children.length > 0) {
//             for (var i in child.relations.children) {
//                 var nextChild = child.getBloqById(child.relations.children[i]);
//                 var nextLocation = nextChild.location;
//                 child.connectBloqs(child, nextChild, nextLocation);
//             }
//         }
//     }
// };
utils.moveBloq = function(bloq, location) {
    "use strict";
    // var initX = bloq.x();
    // var initY = bloq.y();
    bloq.x(location.x);
    bloq.y(location.y);
    // console.log('MOVEBLOQ:', initX, bloq.x(), initY,bloq.y());
    // return [(initX - bloq.x()), (initY-bloq.y())];
};
utils.createConnectors = function(bloq, bloqData) {
    "use strict";
    var connectionThreshold = 20; // px
    bloq.connections = {};
    if (bloqData.inputs) {
        bloq.connections.inputs = [{
            location: undefined,
            type: ''
        }];
    }
    if (bloqData.output) {
        bloq.connections.output = {
            location: undefined,
            type: bloqData.output
        };
    }
    if (bloqData.up) {
        bloq.connections.up = {
            positionInBloq: {},
            location: {}
        };
        bloq.connections.up.positionInBloq = {
            x: bloq.x(),
            y: bloq.y() - bloq.size.height
        };
        bloq.connections.up.location = {
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
            positionInBloq: {},
            location: {}
        };
        bloq.connections.down.positionInBloq = {
            x: bloq.x(),
            y: bloq.y() + bloq.size.height
        };
        bloq.connections.down.location = {
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
    if (bloq.connections.up) {
        bloq.connections.up.positionInBloq.x += bloq.delta.x;
        bloq.connections.up.positionInBloq.y += bloq.delta.y;
        bloq.connections.up.location.x1 += bloq.delta.x;
        bloq.connections.up.location.x2 += bloq.delta.x;
        bloq.connections.up.location.y1 += bloq.delta.y;
        bloq.connections.up.location.y2 += bloq.delta.y;
    }
    if (bloq.connections.down) {
        bloq.connections.down.positionInBloq.x += bloq.delta.x;
        bloq.connections.down.positionInBloq.y += bloq.delta.y;
        bloq.connections.down.location.x1 += bloq.delta.x;
        bloq.connections.down.location.x2 += bloq.delta.x;
        bloq.connections.down.location.y1 += bloq.delta.y;
        bloq.connections.down.location.y2 += bloq.delta.y;
    }
    // if (bloq.connections.output !== undefined) {
    //     bloq.connections.output.positionInBloq = {
    //         x: posx,
    //         y: posy
    //     };
    //     bloq.connections.output.location = {
    //         x1: posx,
    //         x2: posx + connectionThreshold,
    //         y1: posy,
    //         y2: posy + bloqHeight
    //     };
    // }
    // /**
    //  * We store the positions of the input connections of the bloq here
    //  */
    // if (bloq.connections.inputs) {
    //     for (var i in bloq.connections.inputs) {
    //         if (bloq.connections.inputs[i].positionInBloq !== undefined) {
    //             bloq.connections.inputs[i].location = {
    //                 x1: posx + bloq.connections.inputs[i].positionInBloq.x,
    //                 x2: posx + bloq.connections.inputs[i].positionInBloq.x + bloq.connections.inputs[i].positionInBloq.width,
    //                 y1: posy + bloq.connections.inputs[i].positionInBloq.y,
    //                 y2: posy + bloq.connections.inputs[i].positionInBloq.y + bloq.connections.inputs[i].positionInBloq.height
    //             };
    //         } else {
    //             bloq.connections.inputs[i].location = {
    //                 x1: posx + bloqWidth - connectionThreshold,
    //                 x2: posx + bloqWidth,
    //                 y1: posy + i * connectionThreshold,
    //                 y2: posy + (1 + i) * connectionThreshold
    //             };
    //         }
    //     }
    //     bloq.inputsNumber = bloq.connections.inputs.length;
    // }
    // console.log('bloq.connections.inputs', bloq.connections.inputs);
    return bloq.connections;
};
utils.oppositeConnection = {
    inputs: 'output',
    output: 'inputs',
    up: 'down',
    down: 'up'
};
var bloqsNamespace = bloqsNamespace || {};
bloqsNamespace.newBloq = function(bloqData, canvas, position, data) {
    "use strict";
    var connectionThreshold = 20; // px
    var bloq = canvas.group().move(position[0], position[1]);
    bloq.size = {
        width: 0,
        heigh: 0
    };
    bloq.size.width = bloqData.size[0];
    bloq.size.height = bloqData.size[1];
    bloq.delta = {
        x: 0,
        y: 0,
        lastx: 0,
        lasty: 0
    };
    bloq.connections = utils.createConnectors(bloq, bloqData);
    console.log('initially : ', bloq.node.id, bloq.connections.up.location, bloq.connections.down.location);
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

 
    bloq.body = bloq.rect(bloq.size.width, bloq.size.height).fill(bloqData.color).radius(10);
    bloq.border = bloq.rect(bloq.size.width, bloq.size.height).fill('none').stroke({
        width: 1
    }).radius(10);
    bloq.selection = bloq.rect(bloq.size.width, bloq.size.height).fill('none').stroke({
        width: 3,
        color: '#FFCC33'
    }).radius(10).hide();
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
        var margin = 10;
        var posx = margin;
        var width = 0;
        var posy = margin;
        for (var j in bloqData.text) {
            for (var i in bloqData.text[j]) {
                if (typeof(bloqData.text[j][i]) === typeof({})) {
                    if (bloqData.text[j][i].input === 'userInput') {
                        bloq.appendUserInput(bloqData.text[j][i].label, bloqData.text[j][i].type, posx, posy, i);
                        posx += 110;
                    } else if (bloqData.text[j][i].input === 'bloqInput') {
                        bloq.appendBloqInput(bloqData.text[j][i].label, bloqData.text[j][i].type, posx, posy, i);
                        posx += 110;
                    }
                } else {
                    var text = bloq.text(bloqData.text[j][i]).font({
                        family: 'Helvetica',
                        fill: '#fff',
                        size: 14
                    }).move(posx, posy);
                    posx += text.width() + 30;
                }
            }
            if (posx > width) {
                width = posx;
            }
            posx = margin;
            posy += 50;
        }
        //UPDATE all positions depending on inputs
        bloq.body.size(width, posy);
        bloq.border.size(width, posy);
        bloq.selection.size(width, posy);
        //UPDATE bloq sizes
        bloq.size.width = width;
        bloq.size.height = posy;
    }
    /**
     * We start dragging
     */
    bloq.dragmove = function(a, e) {
        console.log('--------------------------------------> delta.lastx, delta.lasty', bloq.delta.lastx, bloq.delta.lasty);
        bloq.delta.x = a.x - bloq.delta.lastx; //e.movementX;
        bloq.delta.y = a.y - bloq.delta.lasty; //e.movementY;
        bloq.delta.lastx = a.x;
        bloq.delta.lasty = a.y;
        console.log('DRAGMOVE +++++++++++++++++++++++++  deltax, deltay', bloq.node.id, bloq.delta.x, bloq.delta.y);
        bloq.connections = utils.updateConnectors(bloq);
        console.log('DRAGMOVE +++++++++++++++++++++++++connectors[up,down]location', bloq.connections.up.location, bloq.connections.down.location);
        // console.log('connectors[up,down]positionInBloq', bloq.connections.up.positionInBloq, bloq.connections.down.positionInBloq);
        // console.log('bloq location :', bloq.x(), bloq.y());
        //move dragged bloq on top
        bloq.node.parentNode.appendChild(bloq.node);
        var movedBloq = this;
        // remove parent of this and child in parent:
        if (movedBloq.relations.parent !== undefined) {
            movedBloq.getBloqById(movedBloq.relations.parent).deleteChild(movedBloq);
            movedBloq.deleteParent(true);
        }
        // move child bloqs along with this one
        // for (var i in movedBloq.relations.children) {
        //     var childBloq = movedBloq.getBloqById(movedBloq.relations.children[i]);
        //     var parentBloq = movedBloq;
        //     var location = childBloq.location;
        //     this.connectBloqs(parentBloq, childBloq, location);
        // }
    };
    /**
     * We stop dragging
     */
    bloq.dragend = function(a, e) {
        //Initialize lasx y laxy
        bloq.delta.lastx = 0;
        bloq.delta.lasty = 0;
        // console.log('DRAGEND +++++++++++++++++++++++++++++++');
        // console.log('bloq location :', bloq.x(), bloq.y());
        // console.log('connectors[up,down]location', bloq.connections.up.location, bloq.connections.down.location);
        // console.log('connectors[up,down]positionInBloq', bloq.connections.up.positionInBloq, bloq.connections.down.positionInBloq);
        var flag = false;
        for (var j in bloq.connections) {
            if (flag === true) {
                break;
            }
            console.log('Searching connection in bloqs connection:++++++++++++++++++++++++++++++++++', j);
            if (bloq.connections[j] !== undefined) {
                for (var i in data.bloqs) {
                    if (data.bloqs[i].node.id !== bloq.node.id) {
                        if (bloq.manageConnections(j, data.bloqs[i], false) === true) {
                            flag = true;
                            break; //propagate break!
                        }
                    }
                }
            }
        }
    };
    bloq.manageConnections = function(type, connectingBloq) {
        var connectingBloqLocation = utils.oppositeConnection[type];
        // if (connectingBloqLocation === 'inputs') {
        //     if (connectingBloq.connections[connectingBloqLocation] !== undefined && this.connections[type] !== undefined) {
        //         for (var i in connectingBloq.connections[connectingBloqLocation]) {
        //             console.log('aaaaaaaaaaaa', this.connections[type], connectingBloq.connections[connectingBloqLocation][i]);
        //             if (this.connections[type].type === connectingBloq.connections[connectingBloqLocation][i].type) { // if the type is the same
        //                 if (this.itsOver(this.connections[type].location, connectingBloq.connections[connectingBloqLocation][i].location)) {
        //                     console.log('connectingBloq.connections[connectingBloqLocation][i].positionInBloq', connectingBloq.connections[connectingBloqLocation][i]);
        //                     utils.moveBloq(this, connectingBloq.connections[connectingBloqLocation][i].positionInBloq);
        //                     this.updateConnectors();
        //                     connectingBloq.updateConnectors();
        //                     console.log('INPUT : isover!!');
        //                 } else {
        //                     console.log('INPUT: not over');
        //                 }
        //             }
        //         }
        //     }
        // } else {
        if (connectingBloq.connections[connectingBloqLocation] !== undefined && bloq.connections[type] !== undefined && bloq.connections[type].type === connectingBloq.connections[connectingBloqLocation].type) { // if the type is the same
            if (bloq.itsOver(bloq.connections[type].location, connectingBloq.connections[connectingBloqLocation].location)) {
                console.log('isover!! ---> ', type);
                // console.log('moving to :', connectingBloq.connections[connectingBloqLocation].positionInBloq);
                // console.log('conectors location BEFORE UPDATE:', connectingBloq.connections[connectingBloqLocation].location, bloq.connections[type].location);
                // console.log('conectors positionInBloq BEFORE UPDATE:', connectingBloq.connections[connectingBloqLocation].positionInBloq, bloq.connections[type].positionInBloq);
                bloq.delta.x = connectingBloq.connections[connectingBloqLocation].location.x1 - bloq.connections[type].location.x1;
                bloq.delta.y = connectingBloq.connections[connectingBloqLocation].location.y1 - bloq.connections[type].location.y1;
                var a = utils.moveBloq(bloq, connectingBloq.connections[connectingBloqLocation].positionInBloq);
                console.log('deltas:', bloq.delta.x, bloq.delta.y, connectingBloq.delta.x, connectingBloq.delta.y);
                bloq.connections = utils.updateConnectors(bloq);
                bloq.delta.lastx = 0;
                bloq.delta.lasty = 0;
                console.log('ids:', bloq.node.id, connectingBloq.node.id);
                console.log('conectors location AFTER UPDATE: connectingBloq, this:', connectingBloq.connections[connectingBloqLocation].location, bloq.connections[type].location);
                console.log('conectors positionInBloq AFTER UPDATE:connectingBloq, this:', connectingBloq.connections[connectingBloqLocation].positionInBloq, bloq.connections[type].positionInBloq);
                return true;
            } else {
                console.log('not over');
                console.log('conectors location:', connectingBloq.connections[connectingBloqLocation].location, bloq.connections[type].location);
            }
            // }
        }
        return false;
    };
    bloq.updateBloqs = function(parent, child) {
        parent.setChildren(child.node.id, child.location);
        child.setParent(parent.node.id);
    };
    bloq.itsOver = function(dragRect, staticRect) {
        if (dragRect !== undefined && staticRect !== undefined) {
            console.log('dragRect.x1 < staticRect.x2 && dragRect.x2 > staticRect.x1 && dragRect.y1 < staticRect.y2 && dragRect.y2 > staticRect.y1', dragRect.x1 < staticRect.x2 && dragRect.x2 > staticRect.x1 && dragRect.y1 < staticRect.y2 && dragRect.y2 > staticRect.y1);
            console.log('dragRect.x1 < staticRect.x2 && dragRect.x2 > staticRect.x1 && dragRect.y1 < staticRect.y2 && dragRect.y2 > staticRect.y1', dragRect.x1 < staticRect.x2, dragRect.x2 > staticRect.x1, dragRect.y1 < staticRect.y2, dragRect.y2 > staticRect.y1);
            console.log('dragRect.x1 < staticRect.x2 && dragRect.x2 > staticRect.x1 && dragRect.y1 < staticRect.y2 && dragRect.y2 > staticRect.y1', dragRect.x1, staticRect.x2, dragRect.x2, staticRect.x1, dragRect.y1, staticRect.y2, dragRect.y2, staticRect.y1);
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
        for (var i in this.relations.children) {
            if (this.relations.children[i] === child.node.id) {
                this.relations.children.splice(i, 1);
                break;
            }
        }
        for (i in this.relations.codeChildren) {
            if (this.relations.codeChildren[i] === child.node.id) {
                this.relations.codeChildren.splice(i, 1);
                break;
            }
        }
        for (i in this.relations.inputChildren) {
            if (this.relations.inputChildren[i] === child.node.id) {
                this.relations.inputChildren.splice(i, 1);
                break;
            }
        }
    };
    bloq.setChildren = function(childrenId, location) {
        for (var bloqIndex in this.relations.children) {
            if (childrenId == this.relations.children[bloqIndex]) {
                // it exists, do nothing
                return false;
            }
        }
        // if we made it so far, add a new child
        this.relations.children.push(childrenId);
        if (location === 'up') {
            this.relations.codeChildren.push(childrenId);
        } else {
            this.relations.inputChildren.push(childrenId);
        }
        return true;
    };
    bloq.setParent = function(parentId) {
        this.relations.parent = parentId;
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
        console.log('this.relations.inputChildren', this.getBloqById(this.relations.inputChildren));
        for (var i in this.relations.inputChildren) {
            replacement = this.getBloqById(this.relations.inputChildren).getCode(_function);
            search = '{[' + i + ']}';
            code = code.replace(new RegExp(search, 'g'), replacement);
        }
        for (i = 0; i < this.inputsNumber; i++) {
            search = '{[' + i + ']}';
            code = code.replace(new RegExp(search, 'g'), ' ');
        }
        return code;
    };
    bloq.on('click', function() {
        if (this.label.toLowerCase() != 'loop' && this.label.toLowerCase() != 'setup') {
            // remove other borders
            var canvasChilds = canvas.children();
            $.each(canvasChilds, function(index) {
                if (canvasChilds[index].hasOwnProperty('border')) {
                    // hide selection
                    canvasChilds[index].selection.hide();
                }
            });
            this.selection.show();
        }
    });
    return bloq;
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
    var bloqs = function() {
        return data;
    };
    // Export to the root, which is probably `window`.
    root.bloqs = bloqs;
}(this));