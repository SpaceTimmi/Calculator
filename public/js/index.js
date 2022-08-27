// Get screen 
const display = document.getElementById("display");

let output = "";
let pendingNumbers = [0];

// Numeric operations
document.querySelectorAll(".numbers").forEach(item => {
    item.addEventListener("click", () => addToStack(item, true));
});

// Non-numeric Operations 
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
        console.log(output, pendingNumbers);
    } else {

        if (textValue === " = ") {

        }  else if (textValue === " clear ") {
            output = "";
            pendingNumbers = [0];

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
        console.log(output, pendingNumbers); 
    }
}

function noPreviousEntryConflict(output, textValue) {
    // Checks if the previous entry clashes with the current input (for operands).
    const lastElement = output[output.length - 2];
    const operators = ["+", "-", "*", "/" ]
    
    if (operators.includes(textValue[1]) && operators.includes(lastElement)) {
        return false;
    } else {
        return true;
    }
}

function noConflictMerge(textValue) {
    // This function updates the calculator state as normal.
  output += textValue;
  pendingNumbers.push(0);
}

function conflictMerge(textValue) {
    // This function updates the calculator state if there are two successive uses of operands. 
    let end = output.length - 3;
    output = output.slice(0, end);
    output += textValue;
}
