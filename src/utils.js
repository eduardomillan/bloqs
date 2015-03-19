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
utils.moveBloq = function(bloq2, location) {
    "use strict";
    console.log('movebloq', bloq2, location);
    bloq2.x(location.x);
    bloq2.y(location.y);
};