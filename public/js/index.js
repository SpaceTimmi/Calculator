// State variables.
let output = "";
let pendingNumbers = [0];
let pendingOperations = [];

// Get screen 
const display = document.getElementById("display");



// Numeric operations (adds event listeners to all the numeric buttons)
document.querySelectorAll(".numbers").forEach(item => {
    item.addEventListener("click", () => addToStack(item, true));
});


// Non-numeric operations (adds event listeners to all the non-numeric buttons)  
document.querySelectorAll(".operations").forEach(item => {
    item.addEventListener("click", () => addToStack(item, false));
});



// Helper functions
function addToStack(btn, isNumeric) {
    // Adds numerical values to the screen and keeps track
    // of then via pendingNumbers.
    let textValue = btn.textContent;
    
    if (isNumeric) {
        output += textValue;
        let end = pendingNumbers.length < 1 ? 0 : pendingNumbers.length - 1
        if (output[output.length - 2] == ".") {
            pendingNumbers[end] = parseFloat(pendingNumbers[end].toString() + `.${textValue}`); 
        } else {
            pendingNumbers[end] = parseFloat(pendingNumbers[end].toString() + textValue); 
        }
        updateScreen();
        console.log(output, pendingNumbers, pendingOperations);
    } else {

        if (textValue === " = ") {
            while (pendingOperations.length > 0) {
                computeAnswer();
            }
            output = pendingNumbers[0].toString();

        }  else if (textValue === " clear ") {
            output = "";
            pendingNumbers = [0];
            pendingOperations = [];

        } else if (textValue === " delete ") {
            const operators = [" + ", " - ", " * ", " / "]
            let lastMemberOfArr = pendingNumbers[0].toString();
            let onlyOneDigitRemaining = lastMemberOfArr.split("").length === 1;  // checks if the only number onscreen is a single digit 
            
            if (pendingNumbers.length === 1 && onlyOneDigitRemaining) { 
            // There is nothing in the stack to delete. This is the last number.
                output = "" 
                pendingNumbers = [0];

            } else {
                let lastElem = output.slice(-3);
                if (operators.includes(lastElem)) {  
                    // The delete was invoked for an operand.
                    let end = output.length - 3; 
                    output = output.slice(0, end);

                } else if (output.slice(-1) === ".") {
                    // The delete was invoked for a decimal.
                    output = output.slice(0, -1);
                }
                 else { 
                    // The delete was invoked for a number.
                    let end = output.length - 1;
                    output = output.slice(0, end);

                    let lastNumPosition = pendingNumbers.length - 1;
                    let lastNumStr = pendingNumbers[lastNumPosition].toString();
                
                    if (lastNumStr.length > 1) {
                        lastNumStr = lastNumStr.slice(0, -1);
                        pendingNumbers.pop();
                        pendingNumbers.push(parseFloat(lastNumStr));
                    } else {
                        pendingNumbers.pop();
                    }
                }
            }

        } else if (textValue === " . ") {
            // Handles the " . " button input
            output += "."

        } else {
            // Handles the operators ("+"   "-"    "*"    "/")
            const check = noPreviousEntryConflict(output, textValue);
            if (check) {
                noConflictMerge(textValue);  
            } else {
                conflictMerge(textValue);
            }
        }
        updateScreen();
        console.log(output, pendingNumbers, pendingOperations); 
    }
}

function computeAnswer() {
    const bodmas = [" / ", " * ", " + ", " - "];  // Implementation for brackets missing!!!
    for (let i = 0; i < bodmas.length; i++) {
       let oprIndex = pendingOperations.indexOf(bodmas[i]);
       if (oprIndex != -1) {  // The operand was found in the array of pending operations.
            let removed = pendingNumbers.splice(oprIndex, 2);
            if (bodmas[i] === " / ") {
                pendingOperations.splice(oprIndex, 1);
                let result = removed[0] / removed[1];
                pendingNumbers.splice(oprIndex, 0, result);
                return

            } else if (bodmas[i] === " * ") {
                pendingOperations.splice(oprIndex, 1);
                let result = removed[0] * removed[1];
                pendingNumbers.splice(oprIndex, 0, result);
                return

            } else if (bodmas[i] === " + ") {
                pendingOperations.splice(oprIndex, 1);
                let result = removed[0] + removed[1];
                pendingNumbers.splice(oprIndex, 0, result);
                return

            } else if (bodmas[i] === " - ") {
                pendingOperations.splice(oprIndex, 1);
                let result = removed[0] - removed[1];
                pendingNumbers.splice(oprIndex, 0, result);
                return
            } 
       } 
    } 
}


// Checks if the previous entry clashes with the current input (for operands).
function noPreviousEntryConflict(output, textValue) {
    const lastElement = output[output.length - 2];
    const operators = ["+", "-", "*", "/" ];
    
    if (operators.includes(textValue[1]) && operators.includes(lastElement)) {
        return false;
    } else {
        return true;
    }
}


// This function updates the calculator state as normal.
function noConflictMerge(textValue) {
  output += textValue;
  pendingNumbers.push(0);
  pendingOperations.push(textValue);
}


// This function updates the calculator state if there are two successive uses of operands. 
function conflictMerge(textValue) {
    let end = output.length - 3;
    output = output.slice(0, end);
    output += textValue;
    pendingOperations.push(textValue);
}

function updateScreen() {
    // updates the calculator screen. 
    display.innerHTML = output;
}
