/* 
simple math functions necessary for ANNs,
activation functions and corresponding errror functions
for use by ANN_classes.js
written by Dan Wacker
*/

//constants used in file
const e = 2.71828

export function transpose(arr) {
    //loop through array to check legality and formatting
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
    for (let i=0; i<arr1.length; i++){
        //checks if each row is an array
        if (arr1[i].length === undefined) {
            //change row to array
            arr1[i] = [arr1[i]];
        }
        //checks for consistent row size within the array
        if (!(arr1[i].length === arr1[0].length)){
            //exception thrown for bad array
            throw 'inconsistent row length array 1';
        }
    }
    //loop through array 2 to check legality and formatting
    for (let i=0; i<arr2.length; i++){
        //checks if each row is an array
        if (arr2[i].length === undefined) {
            //change row to array
            arr2[i] = [arr2[i]];
        }
        //checks for consistent row size within the array
        if (!(arr2[i].length === arr2[0].length)){
            //exception thrown for bad array
            throw 'inconsistent row length array 2';
        }
    }
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
    }
    return result;
}

//rectified linear activation unit
function relu(input) {
    if (input < 0) {
        return 0;
    }
    return input;
}

//sigmoid activation
function sigmoid(input) {
    return 1/(1+e**(-input));
}