ANNmath = require('./ANNmath.js');
step = require('./gameFunctions.js').step;
network = require('./Network.js');


exports.newNetwork = (netfile, net) => {
    net.create([9,120,120,120,120,3],['relu','relu','relu','relu','relu']);
    net.save(netfile);
}

exports.blindLearn = (net) => {
    let state = NewGame();
    let path = [];
    let gotFood = false;
    while (state.running) {
        if (path.length > 0) {
                pathTrain(gotFood, path, state, net);
        } else {
            let plan = choosePlan(state, net);
            path = plan.path;
            gotFood = plan.gotFood;
        }
    }
}

exports.exhibition = (net) => {
    let state = NewGame();
    while (state.running) {
        let decisionCode = networkDecision(state, net);
        state.decision = decode(decisionCode);
        step(state);
    }
    exhibitionStep(canv, state, net, function() {
        status.flag = false;
        status.running = false;
    });
}

function pathTrain(gotFood, path, state, net) {
    let decisionCode = path.pop()
    state.decision = decode(decisionCode);
    let input = netInput(state);
    step(state);
    let factor = 0.001;
    if (path.length===0) { 
        if (!gotFood) {
            decisionCode = ANNmath.transpose(ANNmath.sub([1,1,1],decisionCode));
            decisionCode = decisionCode[0];
            factor = 0.001;
        } else {
            factor = 0.001;
        }
        for (let i=0; i<100; i++) {
            net.train(input, decisionCode, (factor));
        }
    // } else {
    //     if (state.v.x===10) {
    //         if ((state.food.x - state.snake[0].x) < 0) {
    //             decisionCode = ANNmath.transpose(ANNmath.sub([1,1,1],decisionCode));
    //             decisionCode = decisionCode[0];
    //         }
    //     } else if (state.v.y===10) {
    //         if ((state.food.y - state.snake[0].y) < 0) {
    //             decisionCode = ANNmath.transpose(ANNmath.sub([1,1,1],decisionCode));
    //             decisionCode = decisionCode[0];
    //         }
    //     } else if (state.v.x===-10) {
    //         if ((state.food.x - state.snake[0].x) > 0) {
    //             decisionCode = ANNmath.transpose(ANNmath.sub([1,1,1],decisionCode));
    //             decisionCode = decisionCode[0];
    //         }
    //     } else if (state.v.y===-10) {
    //         if ((state.food.y - state.snake[0].y) > 0) {
    //             decisionCode = ANNmath.transpose(ANNmath.sub([1,1,1],decisionCode));
    //             decisionCode = decisionCode[0];
    //         }
    //     }
    //         net.train(input, decisionCode, (factor));
    }
    
}

function choosePlan(state, net) {
    let randplan = setRandomPlan(state);
    let netplan = setNetworkPlan(state, net);
    if (randplan.gotFood && netplan.gotFood) {
        if (randplan.path.length < netplan.path.length) {
            return randplan;
        } else {
            return netplan;
        }
    } else if (randplan.gotFood) {
        return randplan;
    } else if (netplan.gotFood) {
        return netplan;
    } else {
        if (randplan.path.length > netplan.path.length) {
            return randplan;
        } else {
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
    let results = net.query(netInput(state));
    let decisionCode;
    if (isNaN(results[0])) {
        throw 'network returned nan';
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
        center: ((danger.N)&&(state.v.y===10))||((danger.E)&&(state.v.x===10))||((danger.S)&&(state.v.y===-10))||((danger.W)&&(state.v.x===-10)),
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

function NewGame() {
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
    return state;
}

