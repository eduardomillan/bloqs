var utils = utils || {};

var bloqsNamespace = bloqsNamespace || {};
bloqsNamespace.newBloq = function(bloqData, canvas, position, data) {
    "use strict";
    var connectionThreshold = 50; // px
    var size = bloqData.size;
    var bloq = canvas.group().move(position[0], position[1]);
    bloq.connections = {
        inputs: [{
            location: undefined,
            type: ''
        }],
        output: {
            location: undefined,
            type: ''
        },
        up: {
            location: undefined,
        },
        down: {
            location: undefined,
        }
    };
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
        document.getElementById(id).addEventListener("mousedown", function(e) {
            e.stopPropagation();
        }, false);
        //Check that the input of the user is the one spected
        document.getElementById(id).addEventListener("change", function(e) {
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
        bloq.rect(70, 30).attr({
            fill: '#fff'
        }).move(width, posy);
        //add connector (input, type)
        bloq.connections.inputs.push({
            location: {
                x1: posx + width - connectionThreshold,
                x2: posx + width,
                y1: posy + i * connectionThreshold,
                y2: posy + (1 + i) * connectionThreshold
            },
            type: type
        });
        bloq.inputsNumber = bloqData.inputs.length;
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
        var text = '';
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
    bloq.updateConnectors = function(location) {
        var posx = bloq.x();
        var posy = bloq.y();
        // get size of first child of bloq, that is the rectangle
        var bloqWidth = bloq.first().width();
        var bloqHeight = bloq.first().height();
        if (bloqData.up) {
            bloq.connections.up.location = {
                x1: posx + connectionThreshold,
                x2: posx + bloqWidth - connectionThreshold,
                y1: posy,
                y2: posy + connectionThreshold
            };
        } else {
            bloq.connections.up = undefined;
        }
        if (bloqData.down) {
            bloq.connections.down.location = {
                x1: posx + connectionThreshold,
                x2: posx + bloqWidth - connectionThreshold,
                y1: posy + bloqHeight - connectionThreshold,
                y2: posy + bloqHeight
            };
        } else {
            bloq.connections.down = undefined;
        }
        /**
         * We store the position of the output connection of the bloq here
         */
        if (bloqData.output !== undefined) {
            bloq.connections.output = {
                location: {
                    x1: posx,
                    x2: posx + connectionThreshold,
                    y1: posy,
                    y2: posy + bloqHeight
                },
                type: bloqData.output
            };
        } else {
            bloq.connections.output = undefined;
        }
        /**
         * We store the positions of the input connections of the bloq here
         */
        if (bloqData.inputs) {
            bloq.connections.inputs = [{}];
            for (var i in bloqData.inputs) {
                bloq.connections.inputs.push({
                    location: {
                        x1: posx + bloqWidth - connectionThreshold,
                        x2: posx + bloqWidth,
                        y1: posy + i * connectionThreshold,
                        y2: posy + (1 + i) * connectionThreshold
                    },
                    type: bloqData.inputs[i]
                });
            }
            bloq.inputsNumber = bloqData.inputs.length;
        } else {
            bloq.connections.inputs = undefined;
            bloq.inputsNumber = 0;
        }
        return bloq.connections[location];
    };
    bloq.updateConnectors();
    /**
     * We start dragging
     */
    bloq.dragmove = function() {
        var movedBloq = this;
        // remove parent of this and child in parent:
        if (movedBloq.relations.parent !== undefined) {
            movedBloq.getBloqById(movedBloq.relations.parent).deleteChild(movedBloq);
            movedBloq.deleteParent(true);
        }
        // move child bloqs along with this one
        for (var i in movedBloq.relations.children) {
            var childBloq = movedBloq.getBloqById(movedBloq.relations.children[i]);
            var parentBloq = movedBloq;
            var location = childBloq.location;
            this.connectBloqs(parentBloq, childBloq, location);
        }
    };
    /**
     * We stop dragging
     */
    bloq.dragend = function() {
        this.updateConnectors();
        for (var j in this.connections) {
            if (this.connections[j] !== undefined) {
                for (var i in data.bloqs) {
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
                    if (this.connections[type].type === connectingBloq.connections[connectingBloqLocation][i].type) { // if the type is the same
                        if (this.itsOver(this.connections[type].location, connectingBloq.connections[connectingBloqLocation][i].location)) {
                            this.connectBloqs(connectingBloq, this, type + i);
                        }
                    }
                }
            }
        } else {
            if (connectingBloq.connections[connectingBloqLocation] !== undefined && this.connections[type] !== undefined && this.connections[type].type === connectingBloq.connections[connectingBloqLocation].type) { // if the type is the same
                if (this.itsOver(this.connections[type].location, connectingBloq.connections[connectingBloqLocation].location)) {
                    this.connectBloqs(connectingBloq, this, type);
                }
            }
        }
    };
    /**
     * take 2 bloqs and connect them
     * @param bloq1
     * @param bloq2
     * @param location
     */
    bloq.connectBloqs = function(bloq1, bloq2, location) {
        var parent = bloq1;
        var child = bloq2;
        var newLocation = 'up';
        if (location === 'up') {
            bloq2.x(bloq1.x());
            bloq2.y(bloq1.y() + bloq1.first().height());
        } else if (location === 'down') {
            bloq2.x(bloq1.x());
            bloq2.y(bloq1.y() - bloq1.first().height());
            parent = bloq2;
            child = bloq1;
        } else if (location === 'inputs') {
            bloq2.x(bloq1.x() - bloq1.first().width());
            bloq2.y(bloq1.y());
            parent = bloq2;
            child = bloq1;
            newLocation = 'output';
        } else if (location.indexOf('output') >= 0) {
            var i = parseInt(location.replace('output', ''), 10);
            bloq2.x(bloq1.x() + bloq1.first().width());
            bloq2.y(bloq1.y() + (i - 1));
            newLocation = location;
        }
        child.location = newLocation;
        this.updateBloqs(parent, child);
        parent.updateConnectors();
        child.updateConnectors();
        if (child.relations.children.length > 0) {
            for (var i in child.relations.children) {
                var nextChild = child.getBloqById(child.relations.children[i]);
                var nextLocation = nextChild.location;
                child.connectBloqs(child, nextChild, nextLocation);
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