// @include utils.js
var bloqsNamespace = bloqsNamespace || {};
bloqsNamespace.newBloq = function(bloqData, canvas, position, data) {
    "use strict";
    var connectionThreshold = 50; // px
    var size = bloqData.size;
    var bloq = canvas.group().move(position[0], position[1]);
    bloq.deltaX = 0;
    bloq.deltaY = 0;
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
            location: undefined,
        };
    }
    if (bloqData.down) {
        bloq.connections.down = {
            location: undefined,
        };
    }
    bloq.oppositeConnection = {
        inputs: 'output',
        output: 'inputs',
        up: 'down',
        down: 'up'
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
    bloq.appendUserInput = function(inputText, type, posx, posy, id) {
        var text = bloq.foreignObject(100, 100).attr({
            id: 'fobj',
            color: '#FFCC33'
        });
        text.appendChild("input", {
            id: id,
            value: inputText,
            color: '#FFCC33',
        }).move(posx, posy);
        document.getElementById(id).addEventListener("mousedown", function() {
            e.stopPropagation();
        }, false);
        //Check that the input of the user is the one spected
        document.getElementById(id).addEventListener("change", function() {
            if (type === 'number') {
                if (isNaN(parseFloat(document.getElementById(id).value))) {
                    //If type is number and input is not a number, remove user input. 
                    //ToDo : UX warning!
                    document.getElementById(id).value = '';
                }
            }
        }, false);
    };
    bloq.appendBloqInput = function(inputText, type, posx, posy, id) {
        //draw white (ToDo: UX) rectangle
        var width = posx;
        var bloqInput = bloq.rect(70, 30).attr({
            fill: '#fff'
        }).move(width, posy);
        if (bloq.connections.inputs === undefined) {
            bloq.connections.inputs = [{
                location: undefined,
                type: ''
            }];
        }
        //add connector (input, type)
        bloq.connections.inputs.push({
            positionInBloq: {
                x: bloqInput.x(),
                y: bloqInput.y()
            },
            location: {
                x1: posx + width - connectionThreshold,
                x2: posx + width,
                y1: posy + i * connectionThreshold,
                y2: posy + (1 + i) * connectionThreshold
            },
            type: type
        });
        bloq.inputsNumber = bloq.connections.inputs.length;
        console.log('after:', bloq.connections.inputs);
        //add to bloq's inputs
    };
    bloq.body = bloq.rect(size[0], size[1]).fill(bloqData.color).radius(10);
    bloq.border = bloq.rect(size[0], size[1]).fill('none').stroke({
        width: 1
    }).radius(10);
    bloq.selection = bloq.rect(size[0], size[1]).fill('none').stroke({
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
    }
    bloq.getConnections = function(location) {
        return bloq.connections[location];
    };
    /**
     * Updates de position of the connectors of a bloq (used after modifying the bloq's position)
     * @param bloq
     */
    /**
     * Updates de position of the connectors of a bloq (used after modifying the bloq's position)
     * @param bloq
     */
    bloq.updateConnectors = function() {
        var posx = bloq.x();
        var posy = bloq.y();
        // get size of first child of bloq, that is the rectangle
        var bloqWidth = bloq.first().width();
        var bloqHeight = bloq.first().height();
        if (bloq.connections.up) {
            bloq.connections.up.positionInBloq = {
                x: posx,
                y: posy - bloqHeight
            };
            bloq.connections.up.location = {
                x1: posx,
                x2: posx + bloqWidth,
                y1: posy,
                y2: posy + connectionThreshold
            };
        }
        if (bloq.connections.down) {
            bloq.connections.down.positionInBloq = {
                x: posx,
                y: posy + bloqHeight
            };
            bloq.connections.down.location = {
                x1: posx,
                x2: posx + bloqWidth,
                y1: posy + bloqHeight - connectionThreshold,
                y2: posy + bloqHeight
            };
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
    };
    bloq.updateConnectors();
    /**
     * We start dragging
     */
    bloq.dragmove = function(a) {
        bloq.deltaX = a.x;
        bloq.deltaY = a.y;
        console.log('a,e', bloq.deltaX, bloq.deltaY);
        //move dragged bloq on top
        bloq.node.parentNode.appendChild(bloq.node);
        bloq.updateConnectors();
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
    bloq.dragend = function() {
        console.log('this', bloq.connections.output);
        bloq.updateConnectors();
        for (var j in this.connections) {
            if (this.connections[j] !== undefined) {
                for (var i in data.bloqs) {
                    console.log('the other bloq:', data.bloqs[i].connections.inputs);
                    this.manageConnections(j, data.bloqs[i], false);
                }
            }
        }
    };
    bloq.manageConnections = function(type, connectingBloq) {
        var connectingBloqLocation = this.oppositeConnection[type];
        if (connectingBloqLocation === 'inputs') {
            if (connectingBloq.connections[connectingBloqLocation] !== undefined && this.connections[type] !== undefined) {
                for (var i in connectingBloq.connections[connectingBloqLocation]) {
                    console.log('aaaaaaaaaaaa', this.connections[type], connectingBloq.connections[connectingBloqLocation][i]);
                    if (this.connections[type].type === connectingBloq.connections[connectingBloqLocation][i].type) { // if the type is the same
                        if (this.itsOver(this.connections[type].location, connectingBloq.connections[connectingBloqLocation][i].location)) {
                            console.log('connectingBloq.connections[connectingBloqLocation][i].positionInBloq', connectingBloq.connections[connectingBloqLocation][i]);
                            utils.moveBloq(this, connectingBloq.connections[connectingBloqLocation][i].positionInBloq);
                            this.updateConnectors();
                            connectingBloq.updateConnectors();
                            console.log('INPUT : isover!!');
                        } else {
                            console.log('INPUT: not over');
                        }
                    }
                }
            }
        } else {
            if (connectingBloq.connections[connectingBloqLocation] !== undefined && this.connections[type] !== undefined && this.connections[type].type === connectingBloq.connections[connectingBloqLocation].type) { // if the type is the same
                if (this.itsOver(this.connections[type].location, connectingBloq.connections[connectingBloqLocation].location)) {
                    console.log('aaaaaaaaaa', connectingBloq.connections[connectingBloqLocation].positionInBloq, type);
                    utils.moveBloq(this, connectingBloq.connections[connectingBloqLocation].positionInBloq);
                    this.updateConnectors();
                    connectingBloq.updateConnectors();
                    // this.connectBloqs(connectingBloq, this, type);
                    // this.updateConnectors
                    console.log('isover!!');
                } else {
                    console.log('not over');
                }
            }
        }
    };
    bloq.updateBloqs = function(parent, child) {
        parent.setChildren(child.node.id, child.location);
        child.setParent(parent.node.id);
    };
    bloq.itsOver = function(dragRect, staticRect) {
        return dragRect.x1 < staticRect.x2 && dragRect.x2 > staticRect.x1 && dragRect.y1 < staticRect.y2 && dragRect.y2 > staticRect.y1;
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