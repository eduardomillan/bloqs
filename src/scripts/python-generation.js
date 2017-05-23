'use strict';
(function(pythonGeneration) {

    var INDENT_DEFAULT_CHARACTER = '    ';
    var PARAMS_REGEXP = /{(.*?)}/;
    var HEADERCODE = '#!/usr/bin/python\n\nfrom __future__ import absolute_import, print_function, unicode_literals\n\nfrom optparse import OptionParser, make_option\nimport os\nimport sys\nimport socket\nimport uuid\nimport dbus\nimport dbus.service\nimport dbus.mainloop.glib\ntry:\n  from gi.repository import GObject\nexcept ImportError:\n  import gobject as GObject\n\nimport time\n\n###bloques bitbloq para bluetooth###\n\n#escribir un texto en la pantalla del dispositivo movil\ndef escribe_texto(server_sock,texto):\n    server_sock.send("%s\n" % texto)\n\n#movil emite un sonido\ndef emitir_sonido(server_sock, sonido ):\n    server_sock.send("playSound-%s\n" % sonido)\n    time.sleep(1)\n\n#recibe datos por voz o texto\ndef recibe_texto(server_sock):\n    data = server_sock.recv(1024)\n    return data\n\n#enciende/apaga linterna del dispositivo\n#enciende la linterna\ndef enciende_linterna(server_sock):\n    server_sock.send("turnonFlashlight-\n")\n\n#apaga la linterna\ndef apaga_linterna(server_sock):\n    server_sock.send("turnoffFlashlight-\n")\n\n#leer luz ambiente\ndef leer_luz(server_sock):\n    server_sock.send("readLight-\n")\n    dato = recibe_texto(server_sock)\n    print("nivel luz: %s" %dato)\n    return dato\n';
    var CLASSES_CODE = '';
    var FINAL_CODE = '';
    var params = {
        indentCharacter: INDENT_DEFAULT_CHARACTER
    };

    var imports = {},
        instances = {};

    function getCode(bloqFullStructure) {
        console.log('getting code', bloqFullStructure);
        imports = {};
        instances = {};

        var bloqsCode = getCodeFromBLoq(bloqFullStructure);
        var propiedad;
        //after bloqscode to reuse the bucle to fill libraries and instance dependencies
        var importsCode = '';
        for (propiedad in imports) {
            importsCode += 'import ' + propiedad + '\n';
        }

        var instancesCode = '';
        for (propiedad in instances) {
            instancesCode += propiedad + ' = ' + instances[propiedad] + '.' + instances[propiedad] + '()\n';
        }

        var code = '# coding=utf-8\n\n';
        code += HEADERCODE + '\n\n';
        code += importsCode + '\n\n';
        code += instancesCode + '\n\n';
        code += bloqsCode + '\n\n';
        return code;
    }

    function getCodeFromBLoq(bloqFullStructure) {
        console.log('getting code from bloq', bloqFullStructure);

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

        if (bloqFullStructure.python.libraries) {
            for (var i = 0; i < bloqFullStructure.python.libraries.length; i++) {
                imports[bloqFullStructure.python.libraries[i]] = true;
            }
        }

        if (bloqFullStructure.python.needInstanceOf) {
            for (var i = 0; i < bloqFullStructure.python.needInstanceOf.length; i++) {
                instances[bloqFullStructure.python.needInstanceOf[i].name] = bloqFullStructure.python.needInstanceOf[i].type;
            }
        }

        if (aliases) {
            for (var i = 0; i < aliases.length; i++) {
                if (aliases[i].id) {
                    aliasesValuesHashMap[aliases[i].id] = aliases[i].value;
                } else if (aliases[i].bloqInputId && aliases[i].value) {
                    aliasesValuesHashMap[aliases[i].bloqInputId] = getCodeFromBLoq(aliases[i].value);
                }
            }
        }
        if (childs) {
            for (var i = 0; i < childs.length; i++) {
                childsCode += getCodeFromBLoq(childs[i]);
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