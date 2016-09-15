'use strict';
(function(arduinoGeneration) {

    var INDENT_DEFAULT_CHARACTER = '    ',
        PARAMS_REGEXP = /{([^{].[^\s]*?)}/,
        BLOQS_PARAMS_REGEXP = /@{([^{].*?)\.(.*?)}/;


    var includes = {},
    instances = {};

    function getCode(componentsArray, arduinoMainBloqs) {
        console.log('getting code', arduinoMainBloqs);
        includes = {};
        instances = {};

        var code = '';

        var varsCode = getCodeFromBloq(arduinoMainBloqs.varsBloq);
        var setupCode = getCodeFromBloq(arduinoMainBloqs.setupBloq);
        var loopCode = getCodeFromBloq(arduinoMainBloqs.loopBloq);
        var prop;
        //after bloqscode to reuse the bucle to fill libraries and instance dependencies
        var includesCode = '';
        for(prop in includes){
            includesCode += '#include <' + prop + '>\n';
        }

        var instancesCode = '';
        for(prop in instances){
            instancesCode +=  instances[prop] + ' ' + prop  + '()\n';
        }


        code += includesCode + '\n\n';
        code += instancesCode + '\n\n';
        code += varsCode + '\n\n';
        code += setupCode + '\n\n';
        code += loopCode + '\n\n';
        return code;
    }

    function getCodeFromBloq(bloqFullStructure) {
        console.log('getting code from bloq', bloqFullStructure);

        var aliases = bloqFullStructure.content[0],
            childs = bloqFullStructure.childs,
            childsCode = '',
            aliasesValuesHashMap = {};

        if(bloqFullStructure.arduino.includes){
            for (var i = 0; i < bloqFullStructure.arduino.includes.length; i++) {
                includes[bloqFullStructure.arduino.includes[i]] = true;
            }
        }

        if(bloqFullStructure.arduino.needInstanceOf){
            for (var i = 0; i < bloqFullStructure.arduino.needInstanceOf.length; i++) {
                instances[bloqFullStructure.arduino.needInstanceOf[i].name] = bloqFullStructure.arduino.needInstanceOf[i].type;
            }
        }

        if (aliases) {
            for (var i = 0; i < aliases.length; i++) {
                if (aliases[i].id) {
                    aliasesValuesHashMap[aliases[i].id] = {
                        value: aliases[i].value
                    };
                } else if (aliases[i].bloqInputId && aliases[i].value) {
                    aliasesValuesHashMap[aliases[i].bloqInputId] = {};
                    aliasesValuesHashMap[aliases[i].bloqInputId].value = getCodeFromBloq(aliases[i].value);
                    if(aliases[i].value && aliases[i].value.returnType){
                        aliasesValuesHashMap[aliases[i].bloqInputId].returnType = aliases[i].value.returnType.value
                    }
                }
            }
        }
        if (childs) {
            for (var i = 0; i < childs.length; i++) {
                childsCode += getCodeFromBloq(childs[i]);
            }
            aliasesValuesHashMap.STATEMENTS = {
                    value: childsCode
                };
        }

        var code;
        if (bloqFullStructure.arduino.conditional) {
            code = bloqFullStructure.arduino.conditional.code[aliasesValuesHashMap[bloqFullStructure.arduino.conditional.aliasId].value];
        } else {
            code = bloqFullStructure.arduino.code;
        }
        code = code || '';


        var match;
        //searchGroups
        match = BLOQS_PARAMS_REGEXP.exec(code);
        while (match) {
            console.log('match!', match);
            console.log(aliasesValuesHashMap[match[1]]);
            code = code.replace(match[0], aliasesValuesHashMap[match[1]][match[2]]);
            match = BLOQS_PARAMS_REGEXP.exec(code);
        }

        //searchGroups
        match = PARAMS_REGEXP.exec(code);
        while (match) {
            console.log('match!', match);
            console.log(aliasesValuesHashMap[match[1]]);
            code = code.replace(match[0], aliasesValuesHashMap[match[1]].value);
            match = PARAMS_REGEXP.exec(code);
        }

        if (bloqFullStructure.type != 'output') {
            code += '\n';
        }

        return code;
    }

    arduinoGeneration.getCode = getCode;

    return arduinoGeneration;

})(window.arduinoGeneration = window.arduinoGeneration || {}, undefined);
