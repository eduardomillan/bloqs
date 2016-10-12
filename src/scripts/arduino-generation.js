'use strict';
(function(arduinoGeneration) {

    var INDENT_DEFAULT_CHARACTER = '    ',
        PARAMS_REGEXP = /{([^{].[^\s]*?)}/,
        HARDWARE_PARAMS_REGEXP = /\[(.[^\s\.]+?)(\.?)(.[^\s\.]*?)\]/,
        BLOQS_PARAMS_REGEXP = /@{([^{].*?)\.(.*?)}/;


    var includes = {},
        instances = {};

    function getCode(arduinoMainBloqs, hardwareList) {
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
        for (prop in includes) {
            includesCode += '#include <' + prop + '>\n';
        }

        var instancesCode = '',
            instanceId;
        for (instanceId in instances) {
            if (instances[instanceId].arguments) {
                instancesCode += instances[instanceId].type + ' ' + instances[instanceId].realName + '(';
                for (var i = 0; i < instances[instanceId].arguments.length; i++) {
                    if (PARAMS_REGEXP.test(instances[instanceId].arguments[i])) {
                        instances[instanceId].arguments[i] = instances[instanceId].arguments[i].replace(instances[instanceId].name, instances[instanceId].realName);
                    }
                    if (HARDWARE_PARAMS_REGEXP.test(instances[instanceId].arguments[i])) {

                        instances[instanceId].arguments[i] = replaceHardwareVars(instances[instanceId].arguments[i], hardwareList);
                    }
                    instancesCode += ' ' + instances[instanceId].arguments[i] + ',';
                }
                if (instances[instanceId].arguments.length > 1) {
                    instancesCode = instancesCode.slice(0, -1);
                }
                instancesCode += ');\n'
            } else {
                instancesCode += instances[instanceId].type + ' ' + instances[instanceId].name + ';\n';
            }
        }


        code += includesCode + '\n\n';
        code += instancesCode + '\n\n';
        code += varsCode + '\n\n';
        code += setupCode + '\n\n';
        code += loopCode + '\n\n';
        return code;
    }

    function findItemByProperty(searchValue, list, property) {
        var found = null,
            i = 0;
        while (!found && (i < list.length)) {
            if (list[i][property] === searchValue) {
                found = list[i];
            }
            i++;
        }
        return found;
    }

    function replaceHardwareVars(code, hardwareSchema) {
        var result = code,
            match, tempHardwareData;
        match = HARDWARE_PARAMS_REGEXP.exec(code);
        if (match) {
            //console.log('match!', match);
            //console.log('alias', match[1]);
            //console.log('property', match[3]);
            tempHardwareData = findItemByProperty(match[1], hardwareSchema.components, 'name');
            //console.log('hardware Data', tempHardwareData);
            code = code.replace(match[0], tempHardwareData[match[3]]);
        }
        return code;
    }

    function getCodeFromBloq(bloqFullStructure) {
        console.log('getting code from bloq', bloqFullStructure);

        var aliases = bloqFullStructure.content[0],
            childs = bloqFullStructure.childs,
            childsCode = '',
            aliasesValuesHashMap = {},
            matchAliasOnInstance;

        if (bloqFullStructure.arduino.includes) {
            for (var i = 0; i < bloqFullStructure.arduino.includes.length; i++) {
                includes[bloqFullStructure.arduino.includes[i]] = true;
            }
        }

        if (aliases) {
            for (var i = 0; i < aliases.length; i++) {
                if (aliases[i].id) {
                    aliasesValuesHashMap[aliases[i].id] = {
                        value: aliases[i].value || ''
                    };
                } else if (aliases[i].bloqInputId) {
                    aliasesValuesHashMap[aliases[i].bloqInputId] = {};
                    if (aliases[i].value) {
                        aliasesValuesHashMap[aliases[i].bloqInputId].value = getCodeFromBloq(aliases[i].value) || '';

                        if (aliases[i].value.returnType) {
                            aliasesValuesHashMap[aliases[i].bloqInputId].returnType = aliases[i].value.returnType.value || '';
                        }
                    } else {
                        aliasesValuesHashMap[aliases[i].bloqInputId].value = '';
                        aliasesValuesHashMap[aliases[i].bloqInputId].returnType = '';
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

        if (bloqFullStructure.arduino.needInstanceOf) {
            var tempInstanceName,
                tempInstanceId;
            for (var i = 0; i < bloqFullStructure.arduino.needInstanceOf.length; i++) {
                tempInstanceName = bloqFullStructure.arduino.needInstanceOf[i].name;
                if (PARAMS_REGEXP.test(tempInstanceName)) {
                    matchAliasOnInstance = PARAMS_REGEXP.exec(tempInstanceName);
                    tempInstanceName = aliasesValuesHashMap[matchAliasOnInstance[1]].value;
                }
                tempInstanceId = tempInstanceName + String(bloqFullStructure.arduino.needInstanceOf[i].arguments);
                instances[tempInstanceId] = {
                    type: bloqFullStructure.arduino.needInstanceOf[i].type,
                    name: bloqFullStructure.arduino.needInstanceOf[i].name,
                    realName: tempInstanceName,
                    arguments: bloqFullStructure.arduino.needInstanceOf[i].arguments
                };
            }
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
            //console.log('match!', match);
            //console.log(aliasesValuesHashMap[match[1]]);
            code = code.replace(match[0], aliasesValuesHashMap[match[1]][match[2]]);
            match = BLOQS_PARAMS_REGEXP.exec(code);
        }

        //searchGroups
        match = PARAMS_REGEXP.exec(code);
        while (match) {
            //console.log('match!', match);
            //console.log(aliasesValuesHashMap[match[1]]);
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