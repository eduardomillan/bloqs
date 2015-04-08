//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
function OutputBloq(bloqData, canvas, position, data) {
    Bloq.call(this, bloqData, canvas, position, data);
    /**
     * Set this bloq as draggable
     */
    this.bloqBody.draggable();
    //Add the connector to the bloq's UI:
    var path = 'm 36,32 c -4.418,0 -8,-2.582 -8,-7 0,-4.418 3.582,-7 8,-7 l 0,14 z';
    this.bloqBody.connector = this.bloqBody.path(path).fill('#cccccc'); //.move(posx, posy);
    this.bloqBody.connector.x(-8);
    this.bloqBody.add(this.bloqBody.connector);
}
OutputBloq.prototype = Object.create(Bloq.prototype);
// OutputBloq.prototype.getConnectionPosition = function(connectionType, bloqToConnect, inputID) {
//     // connectionType === 'inputs's
//     for (var k in bloq.connections[connectionType]) {
//         //If the input is inline and there is not a bloq connected still
//         if (bloq.connections[connectionType][k].inline === true && k === inputID && bloq.connections[connectionType][k].bloq === undefined) {
//             var delta = {
//                 x: bloqToConnect.size.width - bloq.bloqInput.width,
//                 y: bloqToConnect.size.height - bloq.bloqInput.height
//             };
//             bloq.resize(delta);
//             delta = {
//                 x: bloqToConnect.size.width - bloq.bloqInput.width,
//                 y: 0
//             };
//             for (var i in bloq.UIElements) {
//                 if (bloq.UIElements[i].id === parseInt(inputID, 10)) {
//                     utils.pushElements(bloq, bloq.UIElements[i], delta);
//                     break;
//                 }
//             }
//         }
//     }
//     return bloq.connections[connectionType][inputID].connectionPosition;
// };