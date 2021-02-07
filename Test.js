import {network} from './Network.js';
function test() {
    let net = new network();
    net.create([9,120,120,120,3],['relu','relu','relu','relu']);
    let result = net.query([-0.3, -0.5, -1, 0, 0, 1, 0, 0, 0]);
    result = net.train([0.4, -0.10000000000000003, 0, 1, 0, 0, 1, 1, 0],[0, 1, 1], 0.016666666666666666);
    result = net.train([0.4, -0.10000000000000003, 0, 1, 0, 0, 1, 1, 0],[0, 1, 1], 0.016666666666666666);
    result = net.query([-0.3, -0.5, -1, 0, 0, 1, 0, 0, 0]);
    console.table(result);
}
console.log('start');
test();
console.log('end');