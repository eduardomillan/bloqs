(function(root, undefined) {
    "use strict";
    var data = {
        bloqs: []
    };
    var connectionThreshold = 50; // px
    data.bloqsToCode = function() {
        var setup = 'void setup (){\n';
        var loop = 'void loop (){\n';
        for (var i in data.bloqs) {
            // @todo: this has to change to only reflect the code of connected and valid bloqs
            setup += '  ' + data.bloqs[i].code.setup;
            loop += '  ' + data.bloqs[i].code.loop;
            setup += '\n';
            loop += '\n';
        }
        setup += '}\n';
        loop += '}\n';
        return setup + loop;
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
        /**
         * We store relations here, using nodes
         * @type {{parent: undefined, children: Array}}
         */
        bloq.relations = {
            parent: undefined,
            children: []
        };
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
            // remove parent of this and child in parent!:
            if (movedBloq.relations.parent !== undefined) {
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
        bloq.manageConnections = function(type, connectingBloq) {
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
            for (var i in connectingBloq.connections) {
                if (connectingBloq.connections[i].location === connectingBloqLocation && bloq1.connections[type].type === connectingBloq.connections[i].type) {
                    var connector1 = this.createConnectors(this, bloq1.connections[type].location);
                    var connector2 = this.createConnectors(connectingBloq, connectingBloqLocation);
                    if (this.itsOver(connector1, connector2)) {
                        this.connectBloqs(connectingBloq, this, this.connections[type].location);
                        break;
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
            parent.setChildren(child.node.id);
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
        bloq.setChildren = function(childrenId) {
            for (var bloqIndex in this.relations.children) {
                if (childrenId == this.relations.children[bloqIndex]) {
                    // it exists, do nothing
                    return false;
                }
            }
            // if we made it so far, add a new child
            this.relations.children.push(childrenId);
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