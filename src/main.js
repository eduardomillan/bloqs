(function(root, undefined) {
    "use strict";
    var data = {
        bloqs: []
    };
    data.VERSION = '0.0.0';
    data.createField = function() {
        return true;
    };
    data.createBloq = function(position, connections, color, code) {
        var size = [200, 150];
        var bloq = field.rect(size[0], size[1]).move(position[0], position[1]).fill(color);
        bloq.connections = connections;
        bloq.code = code;
        bloq.draggable();
        // bloq.on('mouseover', function() {
        //     console.log('mouseover', bloq.code);
        // });
        bloq.dragend = function() {
            var bloq1, bloq2;
            var i = 0;
            for (var bloq in data.bloqs) {
                for (var type in this.connections) {
                    if (this.connections[type].location === 'left' && this.node.id !== data.bloqs[bloq].node.id) {
                        for (i in data.bloqs[bloq].connections) {
                            if (data.bloqs[bloq].connections[i].location === 'right' && this.connections[type].type === data.bloqs[bloq].connections[i].type) {
                                bloq1 = leftConnector(this);
                                bloq2 = rightConnector(data.bloqs[bloq]);
                                if (itsOver(bloq1, bloq2)) {
                                    this.x(data.bloqs[bloq].x() + data.bloqs[bloq].width());
                                    this.y(data.bloqs[bloq].y());
                                    break;
                                }
                            }
                        }
                    } else if (this.connections[type].location === 'right' && this.node.id !== data.bloqs[bloq].node.id) {
                        for (i in data.bloqs[bloq].connections) {
                            if (data.bloqs[bloq].connections[i].location === 'left' && this.connections[type].type === data.bloqs[bloq].connections[i].type) {
                                bloq1 = rightConnector(this);
                                bloq2 = leftConnector(data.bloqs[bloq]);
                                if (itsOver(bloq1, bloq2)) {
                                    this.x(data.bloqs[bloq].x() - data.bloqs[bloq].width());
                                    this.y(data.bloqs[bloq].y());
                                    break;
                                }
                            }
                        }
                    } else if (this.connections[type].location === 'up' && this.node.id !== data.bloqs[bloq].node.id) {
                        for (i in data.bloqs[bloq].connections) {
                            if (data.bloqs[bloq].connections[i].location === 'down' && this.connections[type].type === data.bloqs[bloq].connections[i].type) {
                                bloq1 = upConnector(this);
                                bloq2 = downConnector(data.bloqs[bloq]);
                                if (itsOver(bloq1, bloq2)) {
                                    this.x(data.bloqs[bloq].x());
                                    this.y(data.bloqs[bloq].y() + data.bloqs[bloq].height());
                                    break;
                                }
                            }
                        }
                    } else if (this.connections[type].location === 'down' && this.node.id !== data.bloqs[bloq].node.id) {
                        for (i in data.bloqs[bloq].connections) {
                            if (data.bloqs[bloq].connections[i].location === 'up' && this.connections[type].type === data.bloqs[bloq].connections[i].type) {
                                bloq1 = downConnector(this);
                                bloq2 = upConnector(data.bloqs[bloq]);
                                if (itsOver(bloq1, bloq2)) {
                                    this.x(data.bloqs[bloq].x());
                                    this.y(data.bloqs[bloq].y() - data.bloqs[bloq].height());
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        };
        bloq.dragmove = function() {};

        function itsOver(dragRect, staticRect) {
            return dragRect.X1 < staticRect.X2 && dragRect.X2 > staticRect.X1 && dragRect.Y1 < staticRect.Y2 && dragRect.Y2 > staticRect.Y1;
        }

        function leftConnector(bloq) {
            return ({
                X1: bloq.x(),
                X2: bloq.x() + 50,
                Y1: bloq.y(),
                Y2: bloq.y() + bloq.height()
            });
        }

        function rightConnector(bloq) {
            return ({
                X1: bloq.x() + bloq.width() - 50,
                X2: bloq.x() + bloq.width(),
                Y1: bloq.y(),
                Y2: bloq.y() + bloq.height()
            });
        }

        function downConnector(bloq) {
            return ({
                X1: bloq.x(),
                X2: bloq.x() + bloq.width(),
                Y1: bloq.y() + bloq.height() - 50,
                Y2: bloq.y() + bloq.height()
            });
        }

        function upConnector(bloq) {
            return ({
                X1: bloq.x(),
                X2: bloq.x() + bloq.width(),
                Y1: bloq.y(),
                Y2: bloq.y() + 50
            });
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