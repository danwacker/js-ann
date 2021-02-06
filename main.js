import {newNetwork, exhibition, learn} from './gameNet.js';
import {network} from './Network.js';

const netfile = 'snakeNet00.json';
const board = document.getElementById("gameCanvas");
const canv = board.getContext("2d");
const snakeNet = new network;
let status = {
    flag : false
};

let commandlist = [];
commandlist.unshift('create network');
commandlist.unshift('load network');
commandlist.unshift('exhibition');

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
                console.log(snakeNet.weights.length);
                exhibition(snakeNet, canv, status);
                break;
            case 'learn':
                learn(snakeNet, canv, status);
                break;

        }
    }
    if (!(commandlist.length === 0)) {
        console.log('loaded: ' + snakeNet.loaded);
        status.flag = !(snakeNet.loaded);
        setTimeout(function() {
            console.log('status: ' + status.flag)
            handler();
        }, 100);
    } else {
        console.log('command list completed');
    }

}