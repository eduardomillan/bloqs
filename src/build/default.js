// @include ../bloq.js
(function(root, undefined) {
    "use strict";
    var data = {
        bloqs: [],
        code: {
            setup: '',
            loop: ''
        }
    };
    data.bloqsToCode = function() {
        data.functionCode(data.bloqs.setup, 'setup');
        data.functionCode(data.bloqs.loop, 'loop');
        return data.code.setup + data.code.loop;
    };
    data.functionCode = function(bloq, _function) {
        console.log('bloq:',bloq);
        if (bloq === data.bloqs.loop || bloq === data.bloqs.setup) {
            data.code[_function] = bloq.code.loop;
        } else {
            data.code[_function] += '   ' + bloq.getCode(_function);
        }
        if (bloq.relations.codeChildren.length > 0) {
            data.functionCode(bloq.getBloqById(bloq.relations.codeChildren), _function);
        } else {
            data.code[_function] += '\n}\n';
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
        var bloq = bloqsNamespace.newBloq(bloqData, field, position, data);
        console.log('this.connections:', bloq, bloq.connections);
        // console.log('getconnectors:',bloq, bloq.getConnectors('output'));//,bloq.getConnectors('down'),bloq.getConnectors('inputs'),bloq.getConnectors('output'));
        // console.log('getconnections:', bloq.getConnections('up'),bloq.getConnections('down'),bloq.getConnections('inputs'),bloq.getConnections('output'));
        data.bloqs.push(bloq);
        if (bloq.label === 'loop') {
            data.bloqs.loop = bloq;
        } else if (bloq.label === 'setup') {
            data.bloqs.setup = bloq;
        }
        return bloq;
    };
    // Base function.
    var bloqs = function() {
        return data;
    };
    // Export to the root, which is probably `window`.
    root.bloqs = bloqs;
}(this));