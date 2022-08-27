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

            /*
            const operators = [" + ", " - ", " * ", " / " ]
            // If delete is used on the last element then just update pendingNumbers to [0] 
            let strEnd = output.split(" ").reverse().join(" ").indexOf(textValue);
            output = output.slice(0, strEnd);
            if (pendingNumbers.length === 1 && pendingNumbers[0].length === 1) {
                pendingNumbers = [0]
            } else {
                

                
                let lastElem = pendingNumbers[pendingNumbers.length - 1].toString()
                //console.log("LastElem", lastElem)
                if (lastElem.length === 1) {
                    pendingNumbers.pop()
                } else if (lastElem.length > 1 || output[output.length - 1] != " ") {
                    let end = lastElem.length - 1;
                    //console.log("end", end)
                    let result = lastElem.slice(0, end);
                    //console.log("result", result);  
                    pendingNumbers[pendingNumbers.length - 1] = parseFloat(result); 
                } else if (output[output.length - 1] === " ") {
                    let end = lastElem.length - 3
                    let result = lastElem.slice(0, end);
                    pendingNumbers[pendingNumbers.length - 1] = parseFloat(result); 
                }  
            } */

        } else if (textValue === " . ") {
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
