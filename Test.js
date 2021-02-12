import {network} from './Network.js';
import {sub} from './ANNmath.js';
function test() {
    let net = new network();
    net.load('errornet.json');
    let result = net.query([0.4, 0.65, 0, 0, 0, 1, 0, 0, 0]);
    console.log(result);
    console.log(net.weights[0]);
}
console.log('start');
// test();
try {
    // test();
    let result = sub([0,1,1],[0,0,0]);
    console.log(result);
} catch(err) {
    console.log(err);
}
console.log('end');