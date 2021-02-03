ANNmath = require('./ANNmath.js');
network = require('./Network.js');
function test() {
    let net = new network();
    net.create([3,3,3,3,1],['relu','relu','relu','relu']);
    let result = net.query([1, 0, 1]);
    console.log('initial result: ' + result);
    for (let i=0; i < 100 ; i++) {
        net.train([1,0,1],[5],0.01);
        result = net.query([1, 0, 1]);
        console.log('training round ' + i + ' result ' + result + ' out of 5');
        net.train([0,0,1],[1],0.01);
        result = net.query([0, 0, 1]);
        console.log('training round ' + i + ' result ' + result + ' out of 1');
    }
    net.save('net.json');
    let net2 = new network();
    net2.load('net.json');
    result = net2.query([1, 0, 1]);
    console.log('reload result ' + result + ' out of 5');
    result = net2.query([0, 0, 1]);
    console.log('reload result ' + result + ' out of 1');

}
console.log('start');
//test();
console.log('end');