'use strict';
(function(pythonGeneration) {

    var INDENT_CHARACTER = ' ';
    var PARAMS_REGEXP = /{(.*?)}/g;

    function getCode(bloqFullStructure, parentIndent) {
        parentIndent = parentIndent || 0;
        console.log('getting code from bloq', bloqFullStructure);
        var codeLines = bloqFullStructure.python.codeLines,
            aliases = bloqFullStructure.content[0],
            childs = bloqFullStructure.childs,
            childsCode = '',
            aliasesValuesHashMap = {},
            value,
            code = '',
            tempCode,
            match;

        if (aliases) {
            for (var i = 0; i < aliases.length; i++) {
                if (aliases[i].id) {
                    aliasesValuesHashMap[aliases[i].id] = aliases[i].value;
                } else if (aliases[i].bloqInputId && aliases[i].value) {
                    aliasesValuesHashMap[aliases[i].bloqInputId] = getCode(aliases[i].value);
                }
            }
        }
        if (childs) {
            for (var i = 0; i < childs.length; i++) {
                childsCode += getCode(childs[i], parentIndent + 4);
            }
            aliasesValuesHashMap.STATEMENTS = childsCode;
        }

        for (var i = 0; i < codeLines.length; i++) {
            tempCode = INDENT_CHARACTER.repeat(parentIndent + codeLines[i].indentation) + codeLines[i].code;
            //searchGroups
            match = PARAMS_REGEXP.exec(tempCode);
            while (match) {
                console.log('match!', match);
                console.log(aliasesValuesHashMap[match[1]]);
                tempCode = tempCode.replace(match[0], aliasesValuesHashMap[match[1]]);
                match = PARAMS_REGEXP.exec(tempCode);
            }
            code += tempCode;
            if (bloqFullStructure.type != 'output') {
                code += '\n';
            }
        }
        return code;
    }

    pythonGeneration.getCode = getCode;

    return pythonGeneration;

})(window.pythonGeneration = window.pythonGeneration || {}, undefined);