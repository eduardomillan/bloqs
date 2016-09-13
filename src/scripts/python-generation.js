'use strict';
(function(pythonGeneration) {

    var INDENT_DEFAULT_CHARACTER = '    ';
    var PARAMS_REGEXP = /{(.*?)}/;
    var params = {
        indentCharacter: INDENT_DEFAULT_CHARACTER
    };

    var imports = [];


    function getCode(bloqFullStructure, cleanImports) {
        console.log('getting code from bloq', bloqFullStructure, cleanImports);
        if(cleanImports){
            imports = [];
        }
        var codeLines = bloqFullStructure.python.codeLines,
            aliases = bloqFullStructure.content[0],
            childs = bloqFullStructure.childs,
            childsCode = '',
            aliasesValuesHashMap = {},
            value,
            code = '',
            tempCode,
            match,
            numberOfIndents;

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
                childsCode += getCode(childs[i]);
            }
            aliasesValuesHashMap.STATEMENTS = childsCode;
        }

        for (var i = 0; i < codeLines.length; i++) {
            numberOfIndents = (codeLines[i].indentation || 0);
            if (codeLines[i].conditional) {
                tempCode = codeLines[i].conditional.code[aliasesValuesHashMap[codeLines[i].conditional.aliasId]];
            } else {
                tempCode = codeLines[i].code;
            }

            //searchGroups
            match = PARAMS_REGEXP.exec(tempCode);
            while (match) {
                console.log('match!', match);
                console.log(aliasesValuesHashMap[match[1]]);
                tempCode = tempCode.replace(match[0], aliasesValuesHashMap[match[1]]);
                match = PARAMS_REGEXP.exec(tempCode);
            }

            tempCode = tempCode.replace(/^/gm, params.indentCharacter.repeat(numberOfIndents));

            if (bloqFullStructure.type != 'output') {
                tempCode += '\n';
            }

            code += tempCode;
        }
        return code;
    }

    pythonGeneration.getCode = getCode;
    pythonGeneration.params = params;

    return pythonGeneration;

})(window.pythonGeneration = window.pythonGeneration || {}, undefined);
