import {network} from './Network.js';
import {sub} from './ANNmath.js';
function test() {
    let net = new network();
    net.load('errornet.json');
    let input = [0.4, 0.65, 0, 0, 0, 1, 0, 0, 0];
    let result = net.query(input);
    console.log(result);
    net.train(input,result,0.01);
    result = net.query(input);
    console.log(result);
}
console.log('start');
test();
console.log('end');