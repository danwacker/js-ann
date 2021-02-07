import {sub, transpose} from './ANNmath.js';
import {draw} from './visuals.js';
import {step} from './gameFunctions.js';


export function newNetwork(netfile, net) {
    net.create([9,120,120,120,3],['relu','relu','relu','relu']);
    net.save(netfile);
}

export function exhibition(net, canv, status) {
    let state = NewGame(canv);
    exhibitionStep(canv, state, net, function() {
        status.flag = false;
        status.running = false;
    });
}

export function learn(net, canv, status, teller) {
    let state = NewGame(canv);
    executePlan(teller, [], false, state, net, canv, function() {
        status.flag = false;
        status.running = false;
    });
}

  

function exhibitionStep(canv, state, net, _callback) {
    if(state.running) {
        setTimeout(function onTick() {
            let decisionCode = networkDecision(state, net);
            state.decision = decode(decisionCode);
            step(state);
            draw(canv, state);
            exhibitionStep(canv, state,net, function() {
                _callback();
            });
        }, 100);
    } else {
        _callback()
    }
}

function executePlan(teller, path, gotFood, state, net, canv, _callback) {
    if (path.length > 0) {
        setTimeout(function onTick() {
            pathTrain(gotFood, path, state, net, canv);
            executePlan(teller, path, gotFood, state, net, canv, function() {
                _callback();
            });
        }, 100);
    } else if (state.running) {
        let plan = choosePlan(state, net, teller);
        executePlan(teller, plan.path, plan.gotFood, state, net, canv, function() {
            _callback();
        });
    } else {
        _callback();
    }
}

function pathTrain(gotFood, path, state, net, canv) {
    let decisionCode = path.pop()
    state.decision = decode(decisionCode);
    step(state);
    draw(canv, state);
    let factor = 0.01;
    if (path.length<3) {
    if (!gotFood) {
        decisionCode = transpose(sub([1,1,1],decisionCode));
        decisionCode = decisionCode[0];
        factor = 0.2;
    } else {
        factor = 0.2;
    }
    }
    net.train(netInput(state), decisionCode, (factor));
}

function choosePlan(state, net, teller) {
    let randplan = setRandomPlan(state);
    let netplan = setNetworkPlan(state, net);
    if (randplan.gotFood && netplan.gotFood) {
        if (randplan.path.length < netplan.path.length) {
            teller.innerHTML = 'Random';
            return randplan;
        } else {
            teller.innerHTML = 'Network';
            return netplan;
        }
    } else if (randplan.gotFood) {
        teller.innerHTML = 'Random';
        return randplan;
    } else if (netplan.gotFood) {
        teller.innerHTML = 'Network';
        return netplan;
    } else {
        if (randplan.path.length > netplan.path.length) {
            teller.innerHTML = 'Random';
            return randplan;
        } else {
            teller.innerHTML = 'Network';
            return netplan;
        }
    }
}

    
function setRandomPlan(state) {
    let path = [];
    let tempstate = JSON.parse(JSON.stringify(state));
    let len = tempstate.snake.length;
    let pathrun = true;
    while (pathrun) {
        let decisionCode = randomDecision();
        path.unshift(decisionCode);
        tempstate.decision = decode(decisionCode);
        step(tempstate);
        pathrun = (tempstate.running && (len === tempstate.snake.length));
        pathrun = pathrun && path.length < 100;
    }
    return {
        path : path,
        gotFood : !(len === tempstate.snake.length)
    };
}

function setNetworkPlan(state, net) {
    let path = [];
    let tempstate = JSON.parse(JSON.stringify(state));
    let len = tempstate.snake.length;
    let pathrun = true;
    while (pathrun) {
        let decisionCode = networkDecision(tempstate, net);
        path.unshift(decisionCode);
        tempstate.decision = decode(decisionCode);
        step(tempstate);
        pathrun = (tempstate.running && (len === tempstate.snake.length));
        pathrun = pathrun && path.length < 100;
    }
    return {
        path : path,
        gotFood : !(len === tempstate.snake.length)
    };
}

function networkDecision(state, net) {
    let results = net.query(netInput(state))[0];
    let decisionCode;
    if (isNaN(results[0])) {
        console.log('network returned nan results');
    }
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
    let hazard = {
        left: ((danger.N)&&(state.v.x===10))||((danger.E)&&(state.v.y===-10))||((danger.S)&&(state.v.x===-10))||((danger.W)&&(state.v.y===10)),
        center: ((danger.N)&&(state.v.y===10))||((danger.E)&&(state.v.x===10))||((danger.S)&&(state.v.y===-10))||((danger.E)&&(state.v.y===-10)),
        right: ((danger.N)&&(state.v.x===-10))||((danger.E)&&(state.v.y===10))||((danger.S)&&(state.v.x===10))||((danger.W)&&(state.v.y===-10))
    };

    let input = [
        state.snake[0].x/400,
        state.snake[0].y/400,
        state.food.x/400,
        state.food.y/400,
        state.v.x/10,
        state.v.y/10,
        (hazard.left) ? 1 : 0,
        (hazard.center) ? 1 : 0,
        (hazard.right) ? 1 : 0
    ];
    return input;
}

function randomDecision() {
    let dir = Math.floor(Math.random() * 3);
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
    let direction = Math.floor(Math.random()*4);
    switch (direction){
        case 0:
            state.v = {x: 10, y:0}
        break;
        case 1:
            state.v = {x: 0, y:-10}
        break;
        case 2:
            state.v = {x: -10, y:0}
        break;
        case 3:
            state.v = {x: 0, y:10}
        break;
    }
    let head = {x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)};
    for (let i =0; i<5; i++) {
        state.snake[i].x = 100 + 10*head.x - i*state.v.x;
        state.snake[i].y = 100 + 10*head.y - i*state.v.y;
    }
    draw(canv, state);
    return state;
}

export function blindLearn(netfile, iterations, net) {
    net.load(netfile)
    for (let i=0; i<iterations; i++) {
        let state = NewGame();
        while (state.running){
            blindExecutePlan(state, net);
        }
    }
    net.save(netfile);
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