/*global require */
/*jshint latedef: false */
'use strict';

var $ = require('jquery'),
    utils = require('./utils'),
    _ = require('lodash'),
    connectors = {},
    bloqs = {},
    availableConnectors = [];


var dragstart = function(evt) {
    //$(evt.currentTarget).css('transition', 'none');
    // console.log('dragstart');
    var bloq = bloqs[$(evt.currentTarget).attr('data-bloq-id')];



    // console.log(bloq);

    //transparent
    evt.originalEvent.dataTransfer.setDragImage(document.getElementById('empty'), 0, 0);

    var mousePosition = utils.getMousePosition(evt.currentTarget);

    evt.currentTarget.setAttribute('data-drag-mouseX', (evt.originalEvent.pageX - mousePosition.x));
    evt.currentTarget.setAttribute('data-drag-mouseY', (evt.originalEvent.pageY - mousePosition.y));

    var acceptTypes = [];

    //first connector
    acceptTypes = acceptTypes.concat(connectors[bloq.connectors[0]].data.accept);
    //las Children Connector
    acceptTypes = acceptTypes.concat(connectors[getLastBottomConnectorUuid(bloq.uuid)].data.accept);



    if (connectors[bloq.connectors[0]].connectedTo) {
        connectors[connectors[bloq.connectors[0]].connectedTo].connectedTo = null;
        connectors[bloq.connectors[0]].connectedTo = null;
    }

    //store the avaliable connectors
    var notAvailableConnectors = getBranchsConnectors(bloq.uuid);
    var totalConectorsUuids = _.keys(connectors);
    availableConnectors = _.difference(totalConectorsUuids, notAvailableConnectors);


    //bloq.$bloq.addClass('');
    for (var i = 0; i < notAvailableConnectors.length; i++) {
        bloqs[connectors[notAvailableConnectors[i]].bloqUuid].$bloq.addClass('dragging');
    }

    //console.log(availableConnectors);
    //console.log(notAvailableConnectors);

};

var getLastBottomConnectorUuid = function(bloqUuid) {
    if (connectors[bloqs[bloqUuid].connectors[1]].connectedTo) {
        return getLastBottomConnectorUuid(connectors[connectors[bloqs[bloqUuid].connectors[1]].connectedTo].bloqUuid);
    } else {
        return bloqs[bloqUuid].connectors[1];
    }

};

var getBranchsConnectors = function(bloqUuid) {
    var bloq = bloqs[bloqUuid];
    //console.log('tiene un hijo', connectors[bloq.connectors[1]].connectedTo);
    if (!connectors[bloq.connectors[1]].connectedTo) {
        return bloq.connectors;
    } else {
        var bloqBranchUuid = connectors[connectors[bloq.connectors[1]].connectedTo].bloqUuid;
        return _.uniq(bloq.connectors.concat(getBranchsConnectors(bloqBranchUuid)));
    }
};

var drag = function(evt) {

    if (evt.originalEvent.clientX && evt.originalEvent.clientY) {
        var bloq = bloqs[$(evt.currentTarget).attr('data-bloq-id')];
        var target = evt.currentTarget,
            x = evt.originalEvent.clientX,
            y = evt.originalEvent.clientY;

        var originX = target.style.left,
            originY = target.style.top;


        var destinationX = (x - target.getAttribute('data-drag-mouseX')),
            destinationY = (y - target.getAttribute('data-drag-mouseY'));

        target.style.left = destinationX + 'px';
        target.style.top = destinationY + 'px';


        var deltaX = destinationX - parseInt(originX, 10),
            deltaY = destinationY - parseInt(originY, 10);
        //console.log('deltaX', deltaX, 'deltaY', deltaY);

        //console.log('start move conected bloqs', connectors[bloq.connectors[1]].connectedTo);

        moveTreeNodes(connectors[bloq.connectors[1]].connectedTo, deltaX, deltaY);


        handleCollisions([bloq.connectors[0], getLastBottomConnectorUuid(bloq.uuid)], evt);
    }

};

var moveTreeNodes = function(topConnectorUuid, deltaX, deltaY, goUp) {
    if (topConnectorUuid) {
        var bloq = bloqs[connectors[topConnectorUuid].bloqUuid];
        bloq.$bloq.offset({
            top: bloq.$bloq.offset().top + deltaY,
            left: bloq.$bloq.offset().left + deltaX
        });
        if (goUp) {
            moveTreeNodes(connectors[bloq.connectors[0]].connectedTo, deltaX, deltaY, goUp);
        } else {
            moveTreeNodes(connectors[bloq.connectors[1]].connectedTo, deltaX, deltaY, goUp);
        }


    }
};

var dragend = function() {

    $('.bloq').removeClass('dragging');
    var $dropConnector = $('.connector.avaliable');
    if ($dropConnector[0]) {
        var dropConnectorUuid = $dropConnector.attr('data-connector-id');
        var dragConnectorUUid = $('[data-connector-id="' + dropConnectorUuid + '"]').attr('data-canconnectwith');

        //console.log('dragConnectorUUid', dragConnectorUUid);
        //console.log('dropUuid', dropConnectorUuid);
        placeNestedBloq(dropConnectorUuid, dragConnectorUUid);
        setConnections(dragConnectorUUid, dropConnectorUuid);
    }
    $('.connector.avaliable').removeClass('avaliable');

    availableConnectors = [];
    drawTree(bloqs, connectors);
};

var handleCollisions = function(dragConnectors) {
    var i,
        found,
        $dropConnector,
        $dragConnector;

    // For each available connector
    availableConnectors.forEach(function(dropConnectorUuid) {
        $dropConnector = $('[data-connector-id="' + dropConnectorUuid + '"]');
        i = 0;
        found = false;
        while (!found && (i < dragConnectors.length)) {
            $dragConnector = $('[data-connector-id="' + dragConnectors[i] + '"]');

            if ((connectors[dragConnectors[i]].data.type === connectors[dropConnectorUuid].data.accept) && utils.itsOver($dragConnector, $dropConnector, 20)) {
                found = true;
            } else {
                i++;
            }
        }
        if (found) {
            $dropConnector.addClass('avaliable');
            $dropConnector.attr('data-canconnectwith', dragConnectors[i]);
        } else {
            $dropConnector.removeClass('avaliable');
            $dropConnector.removeAttr('data-canconnectwith');
        }
    });
};

var setConnections = function(dropConnectorUuid, dragConnectorUUid) {
    console.log('conectamos', dropConnectorUuid, connectors[dropConnectorUuid].data.type, 'con ', dragConnectorUUid, connectors[dragConnectorUUid].data.type);
    console.log('conectado con', connectors[dropConnectorUuid].connectedTo, 'y el otro con', connectors[dragConnectorUUid].connectedTo);
    // if(a.connectedTo){

    // }
    connectors[dropConnectorUuid].connectedTo = dragConnectorUUid;
    connectors[dragConnectorUUid].connectedTo = dropConnectorUuid;
};

var placeNestedBloq = function(dropConnectorUuid, dragConnectorUUid) {
    console.log('Nest');

    var dropBloq = bloqs[connectors[dropConnectorUuid].bloqUuid],
        dragBloq = bloqs[connectors[dragConnectorUUid].bloqUuid];
    console.log(dropBloq, dragBloq);

    switch (dropBloq.bloqData.type) {
        case 'statement':
            var originX = dragBloq.$bloq.offset().left,
                originY = dragBloq.$bloq.offset().top,
                finalTop,
                finalLeft = dropBloq.$bloq.offset().left,
                goUp = false,
                connectorsStart = connectors[dragBloq.connectors[1]].connectedTo;
            if (connectors[dropConnectorUuid].data.type === 'connector--top') {
                finalTop = dropBloq.$bloq.offset().top - dragBloq.$bloq.height() - 2;
                connectorsStart = connectors[dragBloq.connectors[0]].connectedTo;
                goUp = true;
            } else {
                finalTop = dropBloq.$bloq.offset().top + dragBloq.$bloq.height() + 2;
            }
            dragBloq.$bloq.offset({
                top: finalTop,
                left: finalLeft
            });
            moveTreeNodes(connectorsStart, finalLeft - originX, finalTop - originY, goUp);
            break;
        case 'output':
            break;
        default:
            throw 'bloqtype not defined in nesting' + dropBloq.bloqData.type;
    }
};

var drawTree = function(bloqs, connectors) {
    console.log('drawtree');
    //buscamos los tipo statement q no tienen un top conectado
    for (var uuid in bloqs) {

        if (bloqs[uuid].bloqData.type === 'statement') {
            if (!connectors[bloqs[uuid].connectors[0]].connectedTo) {
                console.log('******* - tree - *********', uuid);
                console.log('connector--top:', bloqs[uuid].connectors[0]);
                console.log('connector--bottom:', bloqs[uuid].connectors[1]);
                if (connectors[bloqs[uuid].connectors[1]].connectedTo) {
                    drawBranch(bloqs, connectors, connectors[bloqs[uuid].connectors[1]].connectedTo);
                }

            }
        }

    }
};

var drawBranch = function(bloqs, connectors, topConnectorUuid) {
    var branchUuid = connectors[topConnectorUuid].bloqUuid;
    console.log('          ******* - branch - *********', branchUuid);
    console.log('          connector--top:', bloqs[branchUuid].connectors[0]);
    console.log('          connector--bottom:', bloqs[branchUuid].connectors[1]);
    if (connectors[bloqs[branchUuid].connectors[1]].connectedTo) {
        drawBranch(bloqs, connectors, connectors[bloqs[branchUuid].connectors[1]].connectedTo);
    }
};


// Block Constructor
var Bloq = function Bloq(params) {

    this.uuid = utils.generateUUID();

    this.bloqData = params.bloqData;
    this.connectors = [];

    //creation

    this.$bloq = $('<div>').attr({
        'data-bloq-id': this.uuid,
        draggable: true,
        tabIndex: 0
    });

    this.$bloq.addClass('bloq bloq--' + this.bloqData.type);


    //connectors
    var $tempConnector, tempUuid;
    for (var i = 0; i < params.bloqData.connectors.length; i++) {
        tempUuid = utils.generateUUID();

        $tempConnector = $('<div>').attr({
            'data-connector-id': tempUuid
        });
        $tempConnector.addClass('connector ' + params.bloqData.connectors[i].type);

        connectors[tempUuid] = {
            jqueryObject: $tempConnector,
            uuid: tempUuid,
            data: params.bloqData.connectors[i],
            bloqUuid: this.uuid,
            connectedTo: null
        };

        this.connectors.push(tempUuid);
        this.$bloq.append($tempConnector);
    }

    //content
    var $tempElement;
    for (var j = 0; j < this.bloqData.content.length; j++) {
        for (var k = 0; k < this.bloqData.content[j].length; k++) {
            $tempElement = utils.createBloqElement(this.bloqData.content[j][k]);
            this.$bloq.append($tempElement);
        }
    }

    this.$bloq.children().not('.connector').first().addClass('bloq__inner--first');
    this.$bloq.children().not('.connector').last().addClass('bloq__inner--last');


    //binds
    this.$bloq.bind('dragstart', dragstart);
    this.$bloq.bind('drag', drag);
    this.$bloq.bind('dragend', dragend);

    bloqs[this.uuid] = this;

    return this.$bloq;
};

module.exports = Bloq;
