const gameNet = require('gameNet.js');
const network = require('Network.js');
const snakeNet = new network;

function main(commandlist) {
    const snakeNet = new network;
    const netfile = 'snakeNet00.json';
    while (!(commandList.length===0)) {
        try{
            let command = commandlist.pop();
            switch(command) {
                case 'new network':
                    gameNet.newNetwork(netfile, snakeNet);
                    status.flag = false;
                    break;
                case 'load network': 
                    snakeNet.load(netfile);
                    break;
                case 'exhibition':
                    status.running = true;
                    gameNet.exhibition(snakeNet);
                    break;
                case 'learn':
                    status.running = true;
                    gameNet.learn(snakeNet);
                    break;
                case 'save network':
                    snakeNet.save(netfile);
                    status.flag = false;
                    break;
                case 'blind learn':
                    gameNet.blindLearn(snakeNet);
                    break;
                default:
                    throw 'invalid command';
                break;
            }
        } catch(err) {
            console.log(err);
            commandlist.push('load network');
        }
    }
}
exports = main;