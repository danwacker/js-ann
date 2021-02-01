import {activate} from './ANN_math_functions.js'

function test() {
    let arr = [
        -1,
        3,
        4
    ];
    console.log(arr);
    console.log(activate(arr,'sigmoid'));
}
console.log('start');
test();
console.log('end');