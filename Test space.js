function test() {
wholeArray = [];
for (let i=0; i<3; i++) {
    arrayPiece = [];
    for (let j=0; j<3; j++) {
        arrayPiece.push(Math.random());
    }
    wholeArray.push(arrayPiece);
}
console.log(wholeArray);
console.log(wholeArray[0]);
console.log(wholeArray.length);
console.log(wholeArray[0].length);
console.log(wholeArray[2][2])
}