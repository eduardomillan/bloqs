(function (root, undefined) {
    "use strict";
    var data = {
        bloqs: [],
        connectedBloqs: [{
            _parent: '',
            _children: [{
                bloq: undefined,
                location: ''
            }]
        }]
    };
    var field = SVG('field1');
    data.VERSION = '0.0.0';
    data.createField = function () {
        return true;
    };
    data.bloqsToCode = function () {
        var setup = 'void setup (){\n';
        var loop = 'void loop (){\n';
        for (var i in data.connectedBloqs) {
            setup += '  ' + data.connectedBloqs[i].code.setup;
            loop += '  ' + data.connectedBloqs[i].code.loop;
            setup += '\n';
            loop += '\n';
        }
        setup += '}\n';
        loop += '}\n';
        var code = setup + loop;
        return code;
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
        bloq.draggable();

        bloq.dragmove = function () {
            if (data.connectedBloqs[this.node.id] !== undefined) {
                //remove parent of this and child in parent!:
                if (data.connectedBloqs[this.node.id]._parent !== undefined) {
                    delete data.connectedBloqs[data.connectedBloqs[this.node.id]._parent.node.id]._children[this.node.id];
                    data.connectedBloqs[this.node.id]._parent = undefined;
                }
                //move child bloqs:
                for (var i in data.connectedBloqs[this.node.id]._children) {
                    var bloq1 = data.connectedBloqs[this.node.id]._children[i].bloq;
                    var bloq2 = this;
                    var location = data.connectedBloqs[this.node.id]._children[i].location;
                    this.connectBloqs(bloq1, bloq2, location);
                }
            }
        };
        bloq.dragend = function () {
            //check if any bloqs have been connected
            for (var bloq in data.bloqs) {
                for (var type in this.connections) {
                    if (this.connections[type].location === 'left' && this.node.id !== data.bloqs[bloq].node.id) {
                        this.manageConnections(type, this, data.bloqs[bloq]);
                    } else if (this.connections[type].location === 'right' && this.node.id !== data.bloqs[bloq].node.id) {
                        this.manageConnections(type, this, data.bloqs[bloq]);
                    } else if (this.connections[type].location === 'up' && this.node.id !== data.bloqs[bloq].node.id) {
                        this.manageConnections(type, this, data.bloqs[bloq]);
                    } else if (this.connections[type].location === 'down' && this.node.id !== data.bloqs[bloq].node.id) {
                        this.manageConnections(type, this, data.bloqs[bloq]);
                    }
                }
            }
            console.log('data.connectedBloqs', data.connectedBloqs);
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
                    if (itsOver(connector1, connector2)) {
                        console.log('aaaaaaaa', bloq1.connections[type].location);
                        this.connectBloqs(bloq1, bloq2, bloq1.connections[type].location);
                        break;
                    }
                }
            }
        };
        bloq.connectBloqs = function (bloq1, bloq2, location) {
            if (location === 'up') {
                bloq1.x(bloq2.x());
                bloq1.y(bloq2.y() + bloq2.height());
                this.updateConnectedBloqs(bloq2, bloq1, location);
            } else if (location === 'down') {
                bloq1.x(bloq2.x());
                bloq1.y(bloq2.y() - bloq2.height());
                this.updateConnectedBloqs(bloq1, bloq2, 'up');
            } else if (location === 'right') {
                bloq1.x(bloq2.x() - bloq2.width());
                bloq1.y(bloq2.y());
                this.updateConnectedBloqs(bloq1, bloq2, 'left');
            } else if (location === 'left') {
                bloq1.x(bloq2.x() + bloq2.width());
                bloq1.y(bloq2.y());
                this.updateConnectedBloqs(bloq2, bloq1, 'left');
            }
        };
        bloq.updateConnectedBloqs = function (parent, child, location) {
            if (data.connectedBloqs[parent.node.id] === undefined || data.connectedBloqs[parent.node.id]._children === undefined) {
                data.connectedBloqs[parent.node.id] = {};
                data.connectedBloqs[parent.node.id]._children = [{}];
            }
            if (data.connectedBloqs[parent.node.id] !== undefined && data.connectedBloqs[parent.node.id]._children[child.node.id] === undefined) {
                data.connectedBloqs[parent.node.id]._children[child.node.id] = {
                    bloq: child,
                    location: location
                };
            }
            if (data.connectedBloqs[child.node.id] === undefined || data.connectedBloqs[child.node.id]._parent === undefined) {
                data.connectedBloqs[child.node.id] = {
                    _parent: parent
                };
            } else if (data.connectedBloqs[child.node.id] !== undefined) {
                data.connectedBloqs[child.node.id]._parent = parent;
            }
        }

        function itsOver(dragRect, staticRect) {
            return dragRect.X1 < staticRect.X2 && dragRect.X2 > staticRect.X1 && dragRect.Y1 < staticRect.Y2 && dragRect.Y2 > staticRect.Y1;
        }

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
        }
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