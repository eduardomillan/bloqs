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
    bloq.x(location.x);
    bloq.y(location.y);
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
            y: bloq.y()
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

