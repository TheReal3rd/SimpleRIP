// JavaScript Web IDE
// Ctrl + Enter to run

let pseudocode = 'DISPLAY "Hello, World"\n'
+'DISPLAY 10 + 25\n' 
+ 'SET test = 10\n'
+ 'SET test2 = 20.5\n'
+ 'SET test3 = \"strTest\"\n'
+ 'DISPLAY test\n'
+ 'INPUT test\n'

const ops = ['+', '-', '*', '/'];

varDict = new Map();

function calc(expr) {
    let i = 0;
    let result = '';
    for (; i < expr.length; ) {
        const ch = expr[i];
        if (/[0-9.]/.test(ch)) {
            result += ch;
        } else if (ops.includes(ch)) { 
            ops.push(result); 
            result = ''; 
        } else return 'Invalid';
        i++;
    }
    // now `ops` has numbers and operators — use Function to evaluate
    const code = ops.join('');
    return new Function('return ' + code)();
}

calc('10 + 20 / 4');   // 7.5
calc('10 * 3 - 1');     // 29

function execute(code) {
    let lines = code.split("\n");
    let index = 0
    errorExitLoop = false;
    errorMsg = "Undefined error within Pseudocode executor.";
    for(;index  != lines.length; index++) {
        line = lines[index];
        spaceIdx = line.indexOf(" ");
        data = line.substring(spaceIdx + 1);
        opCode = line.substring(0, spaceIdx);

        if (errorExitLoop == true) {
            console.error(errorMsg);
            break;
        }

        // Value Arithmatic

        // Instruction execution.
        switch(opCode.trim().toUpperCase()) {
            case "DISPLAY":
                 
                console.log(data.replace(/["']/g, ""));
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

                if(value.includes(".")) {
                    value = Number.parseFloat(value);
                } else if(!value.includes("\"")) {
                    value = Number.parseInt(value);
                } else {
                    value = String(value.replace(/["']/g, "").trim());
                }

                varDict.set(valueName, value);
                console.log(typeof(varDict.get(valueName)))
                break;

            case "INPUT":
                console.log("INPUT DETECTED");
                break;
        }

    }
}


execute(pseudocode)



