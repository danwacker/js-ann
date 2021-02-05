import {sub} from './ANNmath.js';
import {draw} from './visuals.js';
import {step} from './gameFunctions.js';


export function newNetwork(netfile, net) {
    net.create([8,120,120,120,3],['relu','relu','relu','relu']);
    net.save(netfile);
}

export function exhibition(netfile, net, canv) {
    net.load(netfile);
    state = NewGame(canv);
    exhibitionStep(state, net);
}

function NewGame(canv) {
    let state = {
        running : true,
	    eaten : true,
	    food : {x: 0, y: 0},
	    v : {x: 10, y: 0},
	    snake : [
	    	{x: 200, y: 200},
	    	{x: 190, y: 200},
	    	{x: 180, y: 200}, 
	    	{x: 170, y: 200},
	    	{x: 160, y: 200}
        ],
        decision : 'FORWARD'
    };
    draw(canv, state);
    return state;
}

export function learn(iterations, netfile, net, canv) {
    net.load(netfile)
    for (let i=0; i<iterations; i++) {
        state = NewGame(canv);
        executePlan(state, net, canv);
        while (state.running){}
    }
    net.save(netfile)
}

export function blindLearn(netfile, iterations, net) {
    net.load(netfile)
    for (let i=0; i<iterations; i++) {
        state = NewGame();
        while (state.running){
            blindExecutePlan(state, net);
        }
    }
    net.save(netfile);
}

function exhibitionStep(state, net) {
    if(state.running) {
        setTimeout(function onTick() {
            state.direction = decode(networkDecision(state, net));
            step(state);
            draw(canv, state);
            exhibitionStep(state,net);
        }, 100);
    }
}

function executePlan(path, gotFood, state, net, canv) {
    if (path.length > 0) {
        setTimeout(function onTick() {
            if (gotFood) {
                goodTrain(path, state, net, canv);
            } else {
                badTrain(path, state, net, canv);
            }
            executePlan(path, gotFood, state, net, canv);
        }, 100);
    } else if (state.running) {
        plan = choosePlan(state, net);
        executePlan(plan.path, plan.gotFood, state, net, canv);
    }
}

function goodTrain(path, state, net, canv) {
    let decisionCode = path.pop()
    state.direction = decode(decisionCode);
    step(state);
    draw(canv);
    net.train(netInput(state), decisionCode, posFactor/path.length);
}

function badTrain(path, state, net, canv) {
    if (path.length > 0) {
            setTimeout(function onTick() {
                let decisionCode = path.pop()
                state.direction = decode(decisionCode);
                step(state);
                draw(canv);
                net.train(netInput(state), sub([1,1,1],decisionCode), negFactor/path.length);
                badTrain(path, state, net, canv);
        }, 100);
    }
}

function blindExecutePlan(state, net) {
    let plan = choosePlan(state, net);
    let path = plan.path;
    let gotFood = plan.gotFood;
    if (gotFood) {
        while (path.length > 0) {
            let decisionCode = path.pop()
            state.direction = decode(decisionCode);
            step(state);
            net.train(netInput(state), decisionCode, posFactor/path.length);
        }
    } else {
        while (path.length > 0) {
            let decisionCode = path.pop()
            state.direction = decode(decisionCode);
            step(state);
            net.train(netInput(state), sub([1,1,1],decisionCode), negFactor/path.length);
        }
    }
}

function choosePlan(state, net) {
    randplan = setRandomPlan(state);
    netplan = setNetworkPlan(state, net);
    if (randplan.gotFood && netplan.gotFood) {
        return (randplan.path.length < netplan.path.length) ? randplan : netplan;
    } else if (randplan.gotFood) {
        return randplan;
    } else if (netplan.gotFood) {
        return netplan;
    } else {
        return (randplan.path.length > netplan.path.length) ? randplan : netplan;
    }
}

    
function setRandomPlan(state) {
    let path = [];
    let tempstate = state;
    let len = tempstate.snake.length;
    let pathrun = true;
    while (pathrun) {
        let decisionCode = randomDecision();
        path.unshift(decisionCode);
        tempstate.decision = decode(decisionCode);
        step(tempstate);
        pathrun = tempstate.running && (len === tempstate.snake.length);
    }
    return {
        path : path,
        gotFood : !(len === tempstate.snake.length)
    };
}

function setNetworkPlan(state, net) {
    let path = [];
    let tempstate = state;
    let len = tempstate.snake.length;
    let pathrun = true;
    while (pathrun) {
        let decisionCode = networkDecision(tempstate);
        path.unshift(decisionCode);
        tempstate.decision = decode(decisionCode);
        step(tempstate);
        pathrun = tempstate.running && (len === tempstate.snake.length);
    }
    return {
        path : path,
        gotFood : !(len === tempstate.snake.length)
    };
}

function networkDecision(state, net) {
    results = net.query(netInput(state));
    let decisionCode;
    if ((results[0] > results[1]) && (results[0] > results[2])) {
        decisionCode = [1,0,0];
    } else if (results[1] > results[2]) {
        decisionCode = [0,1,0];
    } else {
        decisionCode = [0,0,1];
    }
    return decisionCode;
}

function netInput(state) {
    let danger = {
        N: false,
        E: false,
        S: false,
        W: false
    }
    danger.N = state.snake[0].y === 0;
    danger.E = state.snake[0].x === 390;
    danger.S = state.snake[0].y === 390;
    danger.W = state.snake[0].x === 0;
    for (let i=1; i<state.snake.length; i++) {
        danger.N = danger.N || (state.snake[0].y === state.snake[i].y-10);
        danger.E = danger.E || (state.snake[0].x === state.snake[i].x-10);
        danger.S = danger.S || (state.snake[0].y === state.snake[i].y+10);
        danger.W = danger.W || (state.snake[0].x === state.snake[i].x+10);
    }
    input = [
        state.food.x/400 - state.snake[0].x/400,
        state.food.y/400 - state.snake[0].y/400,
        state.v.x/10,
        state.v.y/10,
        (danger.N) ? 1 : 0,
        (danger.E) ? 1 : 0,
        (danger.S) ? 1 : 0,
        (danger.W) ? 1 : 0
    ];
    return input;
}

function randomDecision() {
    let dir = Math.floor(Math.Random() * 3);
    let decisionCode = [0, 0, 0];
    decisionCode[dir] = 1;
    return decisionCode;
}

function decode(decisionCode) {
    let decision = 'FORWARD';
    if (decisionCode[0]) {
        decision = 'LEFT';
    } else if (decisionCode[1]) {
        decision = 'RIGHT';
    } else {
        decision = 'FORWARD';
    }
    return decision;
}