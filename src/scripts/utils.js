/*jshint bitwise: false*/
'use strict';

var generateUUID = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

var getNumericStyleProperty = function(style, prop) {
    return parseInt(style.getPropertyValue(prop), 10);
};

var getMousePosition = function(element) {
    var x = 0,
        y = 0;
    var inner = true;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        var style = getComputedStyle(element, null);
        var borderTop = getNumericStyleProperty(style, 'border-top-width');
        var borderLeft = getNumericStyleProperty(style, 'border-left-width');
        y += borderTop;
        x += borderLeft;
        if (inner) {
            var paddingTop = getNumericStyleProperty(style, 'padding-top');
            var paddingLeft = getNumericStyleProperty(style, 'padding-left');
            y += paddingTop;
            x += paddingLeft;
        }
        inner = false;
        element = element.offsetParent;
    } while (element);
    return {
        x: x,
        y: y
    };
};


module.exports.generateUUID = generateUUID;
module.exports.getNumericStyleProperty = getNumericStyleProperty;
module.exports.getMousePosition = getMousePosition;