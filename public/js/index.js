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
        // output += texvalue

        if (textValue === " = ") {

        } else if (textValue === " + ") {
            output += textValue;
            pendingNumbers.push(0);

        } else if (textValue === " - ") {
            output += textValue;
            pendingNumbers.push(0);

        } else if (textValue === " * ") {
            output += textValue;
            pendingNumbers.push(0);

        } else if (textValue === " / ") {
            output += textValue;
            pendingNumbers.push(0);

        } else if (textValue === " clear ") {
            output = "";
            pendingNumbers = [0];

        } else if (textValue === " delete ") {
            let strEnd = output.split(" ").reverse().join(" ").indexOf(" ")
            output = output.slice(0, strEnd);
            pendingNumbers.pop()

        } else if (textValue === " . ") {
            output += "."
        }
        console.log(output, pendingNumbers); 
    }
}
