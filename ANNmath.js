/* 
simple math functions necessary for ANNs,
activation functions and corresponding errror functions
for use by ANN_classes.js
written by Dan Wacker
*/

//constants used in file
const e = 2.71828

//checks and edits array formatting for 1 and 2d array functions
function checkArray(arr) {
    //loop through array to check each row/element
    for (let i=0; i<arr.length; i++) {
        //checks if each row is an array
        if (arr[i].length === undefined) {
            //change row to array
            arr[i] = [arr[i]];
        }
        //checks for consistent row size within the array
        if (!(arr[i].length === arr[0].length)) {
            //exception thrown for bad array
            throw 'inconsistent row length array 1';
        }
    }
    return arr;
}

//transpose 1 or 2d arrays
export function transpose(arr) {
    //check array format/legality
    arr = checkArray(arr);
    let result = [];
    for (let i=0; i<arr[0].length; i++) {
        let row = [];
        for (let j=0; j<arr.length; j++) {
            row.push(arr[j][i])
        }
        result.push(row);
    }
    return result;
}

//function for multiplying 2 1d or 2d arrays
export function mult(arr1, arr2) {
    //loop through array 1 to check legality and formatting
    arr1 = checkArray(arr1);
    //loop through array 2 to check legality and formatting
    arr2 = checkArray(arr2);
    //check array sizes
    if (!(arr1[0].length === arr2.length)) {
        //throw exception for mismatched arrays
        throw 'mismatched matrices';
    }
    //create result array
    let result = [];
    //iterate array 1 rows
    for (let i=0; i<arr1.length; i++) {
        //result row array
        let row = [];
        //iterate through array 2 columns
        for (let j=0; j<arr2[0].length; j++) {
            //result element variable
            let sum = 0;
            //iterate array 1 columns and array 2 rows
            for (let k=0; k<arr1[0].length; k++){
                //sum element products
                sum += arr1[i][k]*arr2[k][j];
            }
            //add element to result row
            row.push(sum);
        }
        //add row to result array
        result.push(row);
    }
    //return completed result array
    return result;
}

//array subtraction
export function sub(arr1,arr2) {
//loop through array 1 to check legality and formatting
arr1 = checkArray(arr1);
//loop through array 2 to check legality and formatting
arr2 = checkArray(arr2);
//check array sizes
if (!((arr1.length === arr2.length)&&(arr1[0].length === arr2[0].length))) {
    //throw exception for mismatched arrays
    throw 'mismatched matrices';
}
//create result array
let result = [];
//loop each row
for (let i=0; i<arr1.length; i++) {
    //row var
    let row = [];
    //loop each element
    for (let j=0; j<arr1[0].length; j++) {
        //add element to row
        row.push(arr1[i][j]-arr2[i][j]);
    }
    //add row to result
    result.push(row);
}
return result;
}


/* neuron activation functions
   relu, sigmoid */

export function activate(input,activation) {
    let result = input;
    switch(activation) {
    case 'relu':
        for (let i=0; i<input.length;i++) {
            result[i] = relu(input[i]);
        }
    break;
    case 'sigmoid':
        for (let i=0; i<input.length;i++) {
            result[i] = sigmoid(input[i]);
        }
    break;
    default:
        throw 'bad activation code';
    break;
    }
    return result;
}

export function activeDeriv(input,activation) {
    let result = input;
    switch(activation) {
    case 'relu':
        for (let i=0; i<input.length;i++) {
            result[i] = (result[i] > 0) ? 1 : 0.05;
        }
    break;
    case 'sigmoid':
        for (let i=0; i<input.length;i++) {
            result[i] = sigmoid(input[i])*(1-sigmoid(input[i]));
        }
    break;
    default:
        throw 'bad activation code';
    break;
    }
    return result;
}

//rectified linear activation unit
function relu(input) {
    return (input < 0) ? (0.05*input) : input;
}

//sigmoid activation
function sigmoid(input) {
    return 1/(1+e**(-input));
}