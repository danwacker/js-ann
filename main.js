import {newNetwork, exhibition, learn, blindLearn} from './gameNet.js';
import {network} from './Network.js';


const epochs = 5;
const rounds = 100000;
const trainingtype = 'blind learn';
const neworload = 'load network';
const netfile = 'snakeNet00.json';


const board = document.getElementById("gameCanvas");
const teller = document.getElementById("teller");
const canv = board.getContext("2d");
const snakeNet = new network;
let status = {
    flag : false,
    running : false
};

let commandlist = [];
commandlist.unshift(neworload);
for (let j=0; j<epochs; j++) {
for (let i=0; i<rounds; i++) {
    commandlist.unshift(trainingtype);
}
commandlist.unshift('save network');
}

handler();

function handler() {
    if (!(status.flag)) {
        status.flag = true;
        let command = commandlist.pop();
        console.log('Next command: ' + command);
        switch(command) {
            case 'new network':
                newNetwork(netfile, snakeNet);
                status.flag = false;
                break;
            case 'load network': 
                snakeNet.load(netfile);
                break;
            case 'exhibition':
                status.running = true;
                exhibition(snakeNet, canv, status);
                break;
            case 'learn':
                status.running = true;
                learn(snakeNet, canv, status, teller);
                break;
            case 'save network':
                snakeNet.save(netfile);
                status.flag = false;
                break;
            case 'blind learn':
                blindLearn(snakeNet);
                break;
            default:
                throw 'invalid command';
            break;
        }
    }
    if (!(commandlist.length === 0)) {
        if (!status.running) {
            status.flag = !(snakeNet.loaded);
        }
        setTimeout(function() {
            try {
                handler();
            } catch(err) {
                console.log(err);
                commandlist.push('load network');
                status.flag = false;
                handler();
            }
            
        }, 10);
    } else {
        console.log('command list completed');
    }

}