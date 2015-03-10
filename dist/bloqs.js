(function(root, undefined) {
    "use strict";
    var data = {
        bloqs: [],
        loop: ''
    };
    var connectionThreshold = 50; // px
    data.bloqsToCode = function() {
        var setup = 'void setup (){\n';
        // var loop = '';
        setup += '';
        data.loopToCode(data.bloqs.loop);
        console.log('data.bloqs.loop.codeChildren', data.bloqs.loop.relations.codeChildren);
        // loop += data.loopToCode(data.bloqs.loop); //'  ' + data.bloqs[i].code.loop;
        setup += '\n}\n';
        // loop += '\n}\n';
        return setup + data.loop;
    };
    data.loopToCode = function(bloq) {
        if (bloq === data.bloqs.loop) {
            data.loop = bloq.code.loop;
        } else {
            data.loop += '   ' + bloq.code.loop + ';\n';
        }
        if (bloq.relations.codeChildren.length > 0) {
            data.loopToCode(bloq.getBloqById(bloq.relations.codeChildren));
        } else {
            data.loop += '\n}\n';
        }
    };
    /**
     * Create a bloq and setup its properties and events.
     *
     * @param bloqData bloq object
     * @param field element to create the bloq into
     * @param position x,y position (just useful for the demo version)
     *
     * @returns Object bloq
     */
    data.createBloq = function(bloqData, field, position) {
        var size = bloqData.size;
        var bloq = field.rect(size[0], size[1]).move(position[0], position[1]).fill(bloqData.color);
        bloq.connections = bloqData.connections;
        bloq.code = bloqData.code;
        bloq.label = bloqData.label;
        /**
         * We store relations here, using nodes
         * @type {{parent: undefined, children: Array}}
         */
        bloq.relations = {
            parent: undefined,
            children: [],
            codeChildren: []
        };
        /**
         * We store the code of the inputs of the bloq here
         */
        bloq.inputs = [];
        bloq.location = '';
        /**
         * Set this bloq as draggable
         */
        bloq.draggable();
        /**
         * We start dragging
         */
        bloq.dragmove = function() {
            var movedBloq = this;
            // remove parent of this and child in parent:
            if (movedBloq.relations.parent !== undefined) {
                // console.log('aaa',this.getBloqById(this.relations.parent));
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
            //check if any bloqs have been connected
            for (var bloq in data.bloqs) {
                for (var type in this.connections) {
                    if (this.connections[type].location === 'left' && this !== data.bloqs[bloq]) {
                        this.manageConnections(type, data.bloqs[bloq]);
                    } else if (this.connections[type].location === 'right' && this !== data.bloqs[bloq]) {
                        this.manageConnections(type, data.bloqs[bloq]);
                    } else if (this.connections[type].location === 'up' && this !== data.bloqs[bloq]) {
                        this.manageConnections(type, data.bloqs[bloq]);
                    } else if (this.connections[type].location === 'down' && this !== data.bloqs[bloq]) {
                        this.manageConnections(type, data.bloqs[bloq]);
                    }
                }
            }
        };
        bloq.manageConnections = function(type, connectingBloq, updateParent) {
            var connectingBloqLocation;
            if (this.connections[type].location === 'up') {
                connectingBloqLocation = 'down';
            } else if (this.connections[type].location === 'down') {
                connectingBloqLocation = 'up';
            } else if (this.connections[type].location === 'right') {
                connectingBloqLocation = 'left';
            } else if (this.connections[type].location === 'left') {
                connectingBloqLocation = 'right';
            }
            /**
             * Check if there are any new connections in the bloq's connectors
             */
            var connector1, connector2;
            for (var i in connectingBloq.connections) {
                if (connectingBloq.connections[i].location === connectingBloqLocation && this.connections[type].type === connectingBloq.connections[i].type) {
                    connector1 = this.createConnectors(this, this.connections[type].location);
                    connector2 = this.createConnectors(connectingBloq, connectingBloqLocation);
                    if (this.itsOver(connector1, connector2)) {
                        this.connectBloqs(connectingBloq, this, this.connections[type].location);
                        /**
                         * If updateParent --> update parent's position
                         */
                        if (updateParent === true) {
                            this.connectBloqs(this, this.getBloqById(this.relations.parent), this.connections[type].location);
                        }
                        break;
                    }
                }
            }
            /**
             * Check if there are any new connections in the bloq's child's connectors
             */
            if (this.relations.children.length > 0) {
                for (var child in this.relations.children) {
                    this.getBloqById(this.relations.children[child]).manageConnections(type, connectingBloq, true);
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
            } else if (location === 'right') {
                bloq2.x(bloq1.x() - bloq1.width());
                bloq2.y(bloq1.y());
                parent = bloq2;
                child = bloq1;
                newLocation = 'left';
            } else if (location === 'left') {
                bloq2.x(bloq1.x() + bloq1.width());
                bloq2.y(bloq1.y());
                newLocation = 'left';
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
            return dragRect.X1 < staticRect.X2 && dragRect.X2 > staticRect.X1 && dragRect.Y1 < staticRect.Y2 && dragRect.Y2 > staticRect.Y1;
        };
        bloq.createConnectors = function(bloq, type) {
            if (type === 'left') {
                return ({
                    X1: bloq.x(),
                    X2: bloq.x() + connectionThreshold,
                    Y1: bloq.y(),
                    Y2: bloq.y() + bloq.height()
                });
            } else if (type === 'right') {
                return ({
                    X1: bloq.x() + bloq.width() - connectionThreshold,
                    X2: bloq.x() + bloq.width(),
                    Y1: bloq.y(),
                    Y2: bloq.y() + bloq.height()
                });
            } else if (type === 'down') {
                return ({
                    X1: bloq.x() + connectionThreshold,
                    X2: bloq.x() + bloq.width() - connectionThreshold,
                    Y1: bloq.y() + bloq.height() - connectionThreshold,
                    Y2: bloq.y() + bloq.height()
                });
            } else if (type === 'up') {
                return ({
                    X1: bloq.x() + connectionThreshold,
                    X2: bloq.x() + bloq.width() - connectionThreshold,
                    Y1: bloq.y(),
                    Y2: bloq.y() + connectionThreshold
                });
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
            // console.log('aaaaaaaaaaa',this.relations.children , child.node.id);
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
        if (bloq.label === 'loop') {
            data.bloqs.loop = bloq;
        } else if (bloq.label === 'setup') {
            data.bloqs.setup = bloq;
        }
        data.bloqs.push(bloq);
        return bloq;
    };
    // Base function.
    var bloqs = function() {
        return data;
    };
    // Export to the root, which is probably `window`.
    root.bloqs = bloqs;
}(this));