const gameNet = require('./gameNet.js');
const network = require('./Network.js').network;

exports.main = (params) => {
    const snakeNet = new network();
    const netfile = './snakeNet00.json';
    if (params.load) {
        snakeNet.load(netfile);
        console.log('network loaded');
    } else {
        gameNet.newNetwork(netfile, snakeNet);
        console.log('new network initiated');
    }

    if (params.action==='train') {
        for (let i=0; i<params.epochs; i++) {
            console.log('epoch: ' + i);
            for(let j=0; j<params.rounds; j++){
                try {
                    gameNet.blindLearn(snakeNet);
                } catch(err) {
                    console.log('Error: ' + err);
                    gameNet.load(netfile);
                }
            }
            snakeNet.save(netfile);
        }
        console.log('Training Complete');
    }
}