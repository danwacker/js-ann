//gameNet = require('./gameNet.js');
//Network = require('./Network.js');
import {network} from "./Network.js"
import {newNetwork, exhibition, learn} from "./gameNet.js"

const netfile = 'snakeNet00.json';
const board = document.getElementById("gameCanvas");
const canv = board.getContext("2d");
const snakeNet = new network;

newNetwork(netfile, snakeNet);
exhibition(netfile, snakeNet, canv);
learn(2, netfile, snakeNet, canv);