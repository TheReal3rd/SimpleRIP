// JavaScript Web IDE
// Ctrl + Enter to run

//Project follows https://users.csc.calpoly.edu/~jdalbey/SWE/pdl_std.html

// I hate javascript i hate it!

let pseudocode = 'SET number = 10\n'
+ 'INPUT number \n'
+ 'DISPLAY number\n'

/*
+ 'SET test = 10\n'
+ 'SET test2 = 20.5\n'
+ 'SET test3 = \"strTest\"\n'
+ 'DISPLAY test\n'
+ 'INPUT test\n'
*/

const ops = ['+', '-', '*', '/'];

function replaceWithVars(map, data) {
    map.forEach((value, key, map)=> {
        if(data.includes(key)) {
            data = data.replace(key, value);
        }
    });
    return data
}

function convertValue(value) {
    if(value.includes(".")) {
        return Number.parseFloat(value);
    } else if(!value.includes("\"")) {
        return Number.parseInt(value);
    } else {
        return String(value.replace(/["']/g, "").trim());
    }
}

//TODO Add a replace to swap "to" to "=" instead to reflect capabilities for pseudocode standard.

function execute(code) {
    let lines = code.split("\n");
    let index = 0
    let varMap = new Map();
    let errorExitLoop = false;
    let errorMsg = "Undefined error within Pseudocode executor.";
    let lastDisplayMsg = "";
    for(;index  != lines.length; index++) {
        line = lines[index];
        spaceIdx = line.indexOf(" ");
        data = line.substring(spaceIdx + 1).trim();
        opCode = line.substring(0, spaceIdx).trim();

        if (errorExitLoop == true) {
            console.error(errorMsg);
            break;
        }

        // Instruction execution.
        switch(opCode.trim().toUpperCase()) {
            case "DISPLAY":
                data = replaceWithVars(varMap, data);
                console.log(data.replace(/["']/g, ""));
                lastDisplayMsg = data;
                break;

            case "SET":
                if(!data.includes("=")){
                    errorMsg = "Value Delclaration missing assignment. \"=\" Is missing.";
                    errorExitLoop = true;
                    break;
                }

                eqlIdx = data.indexOf("=");
                value = data.substring(eqlIdx + 1).trim();
                valueName = data.substring(0, eqlIdx).trim();

                value = convertValue(value);

                varMap.set(valueName, value);
                break;

            case "INPUT": // TODO fix prompt or add ability to disable the custom prompt handler.
                lastDisplayMsg = "Enter number:";
                setTimeout(async () => {
                    const inputPrompt = prompt(lastDisplayMsg);
                    value = await inputPrompt;
                    varMap.set(data, value);
                }, 1000);
                break;

            case "COMPUTE":
                if(!data.includes("=")){
                    errorMsg = "Value Delclaration missing assignment. \"=\" Is missing to complete compute.";
                    errorExitLoop = true;
                    break;
                }

                eqlIdx = data.indexOf("=");
                operation = data.substring(eqlIdx + 1).trim();
                valueName = data.substring(0, eqlIdx).trim();

                operation = replaceWithVars(varMap, operation);
                varMap.set(valueName, eval(operation));
                break;
        }

    }
}


execute(pseudocode)



