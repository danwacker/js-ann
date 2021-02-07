import {newNetwork, exhibition, learn} from './gameNet.js';
import {network} from './Network.js';

const netfile = 'snakeNet01.json';
const board = document.getElementById("gameCanvas");
const teller = document.getElementById("teller");
const canv = board.getContext("2d");
const snakeNet = new network;
let status = {
    flag : false,
    running : false
};

let commandlist = [];
commandlist.unshift('load network');
for (let j=0; j<10; j++) {
for (let i=0; i<100; i++) {
    commandlist.unshift('learn');
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
            case 'create network':
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

        }
    }
    if (!(commandlist.length === 0)) {
        if (!status.running) {
            status.flag = !(snakeNet.loaded);
        }
        setTimeout(function() {
            handler();
        }, 100);
    } else {
        console.log('command list completed');
    }

}