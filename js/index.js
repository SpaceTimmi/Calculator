/* ================= Get Screen, Buttons and initialize State Variables =========================*/

// State variables.
let output = "";
let pendingNumbers = [0];
let pendingOperations = [];

// Get screen 
const display = document.getElementById("display");

// Get numeric buttons (class - Numbers) 
document.querySelectorAll(".numbers").forEach(item => {
    item.addEventListener("click", () => addToStack(item, true));
});

// Get non-numeric buttons (class - operations)  
document.querySelectorAll(".operations").forEach(item => {
    item.addEventListener("click", () => addToStack(item, false));
});


/* ================================ Main Function ===========================================*/
function addToStack(btn, isNumeric) {
    let textValue = btn.textContent;
    if (isNumeric) {
        registerNumber(textValue);    
        updateScreen();
        console.log(output, pendingNumbers, pendingOperations);
    } else {
        if (textValue === " = ") {
            registerEqualsToClick();
        }  else if (textValue === " clear ") {
            registerClearBtnClick();
        } else if (textValue === " delete ") {
            registerDelete();            
        } else if (textValue === " . ") {
            registerDecimal(); 
        } else {
            registerOperands(textValue);
        }
        updateScreen();
        console.log(output, pendingNumbers, pendingOperations); 
    }
}

// Helpers //
/* =================================== Updates and Register Functions ==============================*/

function updateScreen() {
    // updates the calculator screen. 
    display.innerHTML = output;
}

function registerDecimal() {
    // adds decimal to screen once clicked.
    output += "."
};

function registerClearBtnClick() {
    // Clears already typed in values from screen and state.
    output = "";
    pendingNumbers = [0];
    pendingOperations = [];
};

function registerEqualsToClick() {
    // Iteratively calls computeAnswer() until there are no more operations and outputs the result. 
    while (pendingOperations.length > 0) {
        computeAnswer();
    }
    output = pendingNumbers[0].toString();
};

function registerNumber(textValue) {
    // Adds number to screen and updates state variables to include said numbers.
    output += textValue;
    let end = pendingNumbers.length < 1 ? 0 : pendingNumbers.length - 1
    pendingNumbers[end] = parseFloat(pendingNumbers[end].toString() + textValue); 
};

function registerOperands(textValue)  {
    // Adds operands to the screen and update state variables to include said operands.
    // Also calls a function (computeDecimal) that handles the conversion of float inputs to decimal.
    // ComputeDecimal is here because if a user clicks on the on an operand (assuming the previous input was a float)
    // then we know the user has finised entering the float value there we can now update state to reflect that.
    const check = noPreviousEntryConflict(output, textValue);
    if (check) {
        noConflictMerge(textValue);  
    } else {
        conflictMerge(textValue);
    }
    computeDecimal(textValue);
};

function registerDelete() {
    // Removes the last clicked value from both state and screen. 
    const operators = [" + ", " - ", " * ", " / "];
    let lastMemberOfArr = pendingNumbers[0].toString();
    let onlyOneDigitRemaining = lastMemberOfArr.split("").length === 1;

    if (pendingNumbers.length === 1 && onlyOneDigitRemaining) { 
        // There is nothing in the stack to delete.
        output = "" 
        pendingNumbers = [0];
    } else {
        
        let lastElem = output.slice(-3);
        if (operators.includes(lastElem)) {  
           // The delete was invoked for an operand.
            let end = output.length - 3; 
            output = output.slice(0, end);
            pendingOperations.pop();
        
        } else if (output.slice(-1) === ".") {
            // The delete was invoked for a decimal.
            output = output.slice(0, -1);
        
        } else { 
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
};


/* ================================ Compute Functions ===========================================*/
function computeAnswer() {
    // Computes the result based on state variables.
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

function computeDecimal() {
    // Only runs (completely) if the last input on screen was a decimal number.
    // It updates state variables to include said decimal number.
    
    // No coverage for last input being a decimal yet!!!
    let decimalStr = output.slice(0, (output.length - 3));
    if (!decimalStr.includes(".")) {
        return
    }
    let newOutput = decimalStr.split("").reverse().join("");
    let end = newOutput.indexOf(" ");
    let sliced = (end !== -1) ? newOutput.slice(0, end) : newOutput
    let reversed = sliced.split("").reverse().join("");
    let decimalFloat = parseFloat(reversed);
    pendingNumbers.splice(-2, 2); 
    pendingNumbers.splice(pendingNumbers.length, 0, decimalFloat, 0);
}


/* ======================================== Checks =================================================  */
// noPreviousEntryConflict takes in two variables, the screen (output) and the key pressed (textValue).
// It returns 'false' if adding the key to output will result in a conflict (e.g. + -) 
// returns 'true' otherwise. 
function noPreviousEntryConflict(output, textValue) {
    const lastElement = output[output.length - 2];
    const operators = ["+", "-", "*", "/" ];
    
    if (operators.includes(textValue[1]) && operators.includes(lastElement)) {
        return false;
    } else {
        return true;
    }
}

/* ======================================== Merge =================================================  */
// Updates state and screen when an operand or number button is clicked.
// noConflictMerge -> Handles cases where is no clash in input. 
// conflictMerge   -> Handles cases where ther is clash in input (e.g. user tries to enter two operands successively)  

function noConflictMerge(textValue) {
  output += textValue;
  pendingNumbers.push(0);
  pendingOperations.push(textValue);
}

function conflictMerge(textValue) {
    let end = output.length - 3;
    output = output.slice(0, end);
    output += textValue;
    pendingOperations.push(textValue);
}

