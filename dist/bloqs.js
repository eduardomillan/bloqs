(function (root, undefined) {
    "use strict";
    var data = {
        bloqs: []
    };

    var field = SVG('field1');
    data.VERSION = '0.0.0';

    data.createField = function () {
        return true;
    };

    data.bloqsToCode = function () {
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
     * @param position x,y position (just useful for the demo version)
     *
     * @returns Object bloq
     */
    data.createBloq = function (bloqData, position) {
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

        bloq.draggable();

        bloq.dragmove = function () {
            var movedBloq = this.getBloqById(this.node.id);
            // remove parent of this and child in parent!:
            if (this.relations.parent !== undefined) {
                movedBloq.deleteParent(true);
            }

            // move child bloqs along with this one
            for (var i in this.relations.children) {
                var childBloq = this.getBloqById(this.children[i]);
                var parentBloq = this;
                var location = childBloq.location;
                this.connectBloqs(parentBloq, childBloq, location);
            }
        };

        bloq.dragend = function () {
            //check if any bloqs have been connected
            for (var bloq in data.bloqs) {
                for (var type in this.connections) {
                    if (this.connections[type].location === 'left' && this !== data.bloqs[bloq]) {
                        this.manageConnections(type, this, data.bloqs[bloq]);
                    } else if (this.connections[type].location === 'right' && this !== data.bloqs[bloq]) {
                        this.manageConnections(type, this, data.bloqs[bloq]);
                    } else if (this.connections[type].location === 'up' && this !== data.bloqs[bloq]) {
                        this.manageConnections(type, this, data.bloqs[bloq]);
                    } else if (this.connections[type].location === 'down' && this !== data.bloqs[bloq]) {
                        this.manageConnections(type, this, data.bloqs[bloq]);
                    }
                }
            }
            console.log('data.bloqs', data.bloqs);
        };

        bloq.manageConnections = function (type, bloq1, bloq2) {
            var bloq2Location;
            if (bloq1.connections[type].location === 'up') {
                bloq2Location = 'down';
            } else if (bloq1.connections[type].location === 'down') {
                bloq2Location = 'up';
            } else if (bloq1.connections[type].location === 'right') {
                bloq2Location = 'left';
            } else if (bloq1.connections[type].location === 'left') {
                bloq2Location = 'right';
            }
            for (var i in bloq2.connections) {
                if (bloq2.connections[i].location === bloq2Location && bloq1.connections[type].type === bloq2.connections[i].type) {
                    var connector1 = this.createConnectors(bloq1, bloq1.connections[type].location);
                    var connector2 = this.createConnectors(bloq2, bloq2Location);
                    if (this.itsOver(connector1, connector2)) {
                        console.log('bloq', bloq1.connections[type].location);
                        this.connectBloqs(bloq1, bloq2, bloq1.connections[type].location);
                        break;
                    }
                }
            }
        };

        /**
         * take 2 bloqs and connect them
         * @param parentBloq
         * @param childBloq
         * @param location
         */
        bloq.connectBloqs = function (parentBloq, childBloq, location) {
            if (location === 'up') {
                childBloq.x(parentBloq.x());
                childBloq.y(parentBloq.y() + parentBloq.height());
                this.updatebloqs(parentBloq, childBloq, location);
            } else if (location === 'down') {
                childBloq.x(parentBloq.x());
                childBloq.y(parentBloq.y() - parentBloq.height());
                this.updatebloqs(childBloq, parentBloq, 'up');
            } else if (location === 'right') {
                childBloq.x(parentBloq.x() - parentBloq.width());
                childBloq.y(parentBloq.y());
                this.updatebloqs(childBloq, parentBloq, 'left');
            } else if (location === 'left') {
                childBloq.x(parentBloq.x() + parentBloq.width());
                childBloq.y(parentBloq.y());
                this.updatebloqs(parentBloq, childBloq, 'left');
            }
        };

        bloq.updatebloqs = function (parent, child, location) {
            if (parent.node.id === undefined || parent.relations.children === undefined) {
                data.bloqs[parent.node.id] = {};
                data.bloqs[parent.node.id].children = [{}];
            }
            if (data.bloqs[parent.node.id] !== undefined && data.bloqs[parent.node.id].children[child.node.id] === undefined) {
                data.bloqs[parent.node.id].children[child.node.id] = {
                    bloq: child,
                    location: location
                };
            }
            if (data.bloqs[child.node.id] === undefined || data.bloqs[child.node.id].parent === undefined) {
                data.bloqs[child.node.id] = {
                    parent: parent
                };
            } else if (data.bloqs[child.node.id] !== undefined) {
                data.bloqs[child.node.id].parent = parent;
            }
        };

        bloq.itsOver = function (dragRect, staticRect) {
            return dragRect.X1 < staticRect.X2 && dragRect.X2 > staticRect.X1 && dragRect.Y1 < staticRect.Y2 && dragRect.Y2 > staticRect.Y1;
        };

        bloq.createConnectors = function (bloq, type) {
            if (type === 'left') {
                return ({
                    X1: bloq.x(),
                    X2: bloq.x() + 50,
                    Y1: bloq.y(),
                    Y2: bloq.y() + bloq.height()
                });
            } else if (type === 'right') {
                return ({
                    X1: bloq.x() + bloq.width() - 50,
                    X2: bloq.x() + bloq.width(),
                    Y1: bloq.y(),
                    Y2: bloq.y() + bloq.height()
                });
            } else if (type === 'down') {
                return ({
                    X1: bloq.x() + 50,
                    X2: bloq.x() + bloq.width() - 50,
                    Y1: bloq.y() + bloq.height() - 50,
                    Y2: bloq.y() + bloq.height()
                });
            } else if (type === 'up') {
                return ({
                    X1: bloq.x() + 50,
                    X2: bloq.x() + bloq.width() - 50,
                    Y1: bloq.y(),
                    Y2: bloq.y() + 50
                });
            }
        };

        // utilities
        bloq.deleteParent = function (cascade) {
            if (cascade !== false) {
                var parentBloq = this.getBloqById(this.parent);
                parentBloq.relations.children = [];
            }
            this.relations.parent = undefined;
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

        data.bloqs.push(bloq);
        return bloq;
    };
    // Base function.
    var bloqs = function () {
        return data;
    };
    // Export to the root, which is probably `window`.
    root.bloqs = bloqs;
}(this));