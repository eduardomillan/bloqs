var bloqsNamespace = bloqsNamespace || {};
bloqsNamespace.newBloq = function(bloqData, field, position, data) {
    "use strict";
    var connectionThreshold = 25; // px
    var size = bloqData.size;
    var bloq = field.rect(size[0], size[1]).move(position[0], position[1]).fill(bloqData.color);
    bloq.connections = {
        inputs: {
            location: undefined,
            type: ''
        },
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
    }
    bloq.code = bloqData.code;
    bloq.label = bloqData.label;
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
    bloq.getConnections = function(location) {
        return bloq.connections[location];
    };
    bloq.updateConnectors = function(location) {
        if (bloqData.up) {
            bloq.connections.up.location = {
                x1: bloq.x() + connectionThreshold,
                x2: bloq.x() + bloq.width() - connectionThreshold,
                y1: bloq.y(),
                y2: bloq.y() + connectionThreshold
            };
        } else {
            bloq.connections.up = undefined;
        }
        if (bloqData.down) {
            bloq.connections.down.location = {
                x1: bloq.x() + connectionThreshold,
                x2: bloq.x() + bloq.width() - connectionThreshold,
                y1: bloq.y() + bloq.height() - connectionThreshold,
                y2: bloq.y() + bloq.height()
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
                    x1: bloq.x(),
                    x2: bloq.x() + connectionThreshold,
                    y1: bloq.y(),
                    y2: bloq.y() + bloq.height()
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
            // for (var i in bloqData.inputs) {
            //     bloq.connections.inputs.push({
            //         location: {
            //             x1: bloq.x() + bloq.width() - connectionThreshold,
            //             x2: bloq.x() + bloq.width(),
            //             y1: bloq.y() + i * connectionThreshold,
            //             y2: bloq.y() + (1 + i) * connectionThreshold
            //         },
            //         type: bloqData.inputs[i]
            //     });
            // }
            // bloq.inputsNumber = bloqData.inputs.length;
            bloq.connections.inputs = {
                location: {
                    x1: bloq.x() + bloq.width() - connectionThreshold,
                    x2: bloq.x() + bloq.width(),
                    y1: bloq.y(),
                    y2: bloq.y() + bloq.height()
                },
                type: bloqData.inputs
            };
            bloq.inputsNumber = 1;
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
    bloq.manageConnections = function(type, connectingBloq, updateParent) {
        var connectingBloqLocation = this.oppositeConnection[type];
        if (connectingBloq.connections[connectingBloqLocation] !== undefined && this.connections[type] !== undefined && this.connections[type].type === connectingBloq.connections[connectingBloqLocation].type) { // if the type is the same
            if (this.itsOver(this.connections[type].location, connectingBloq.connections[connectingBloqLocation].location)) {
                this.connectBloqs(connectingBloq, this, type);
                /**
                 * If updateParent --> update parent's position
                 */
                if (updateParent === true) {
                    this.connectBloqs(this, this.getBloqById(this.relations.parent), this.connections[type].location);
                }
                // break;
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
            bloq2.y(bloq1.y() + bloq1.height());
        } else if (location === 'down') {
            bloq2.x(bloq1.x());
            bloq2.y(bloq1.y() - bloq1.height());
            parent = bloq2;
            child = bloq1;
        } else if (location === 'inputs') {
            bloq2.x(bloq1.x() - bloq1.width());
            bloq2.y(bloq1.y());
            parent = bloq2;
            child = bloq1;
            newLocation = 'output';
        } else if (location === 'output') {
            bloq2.x(bloq1.x() + bloq1.width());
            bloq2.y(bloq1.y());
            newLocation = 'output';
        }
        child.location = newLocation;
        this.updateBloqs(parent, child);
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
    return bloq;
};