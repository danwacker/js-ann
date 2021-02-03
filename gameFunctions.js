//general game functions

exports = step;

function step(state) {
    changeDirection(state);
    moveSnake(state);
    makeFood(state);
    loseCheck(state);
}

function moveSnake(state) {
    const head = {x: state.snake[0].x + state.v.x, y: state.snake[0].y + state.v.y};
    if (!(head.x === state.food.x && head.y === state.food.y)) {
        state.snake.pop();
    } else {
        state.eaten = true;
    }
    state.snake.unshift(head);
    state.moved = true;
}

function makeFood(state) {
    if (state.eaten) {
        state.food = {x: 10 * Math.floor(Math.random() * 40), y: 10 * Math.floor(Math.random() * 40)};
        if (foodCheck(state)) {
            state.eaten = false;
        } else {
            state = makeFood(state);
        }
    }
}

function foodCheck(state) {
    onBody = state.snake.find(function foodOnSnake(piece) {
        return piece.x === state.food.x && piece.y === state.food.y;
        });
    return onBody === undefined;
}



function loseCheck(state) {
    let gameOver = false;
    for (let i = 1; i < snake.length; i++) {
        gameOver = gameOver || (state.snake[0].x === state.snake[i].x && state.snake[0].y === state.snake[i].y)
    }
    gameOver = gameOver || state.snake[0].x < 0;
    gameOver = gameOver || state.snake[0].x >= 400;
    gameOver = gameOver || state.snake[0].y < 0;
    gameOver = gameOver || state.snake[0].y >= 400;
    state.running = !gameOver;
}

function changeDirection(state) {
        if (state.decision === RIGHT) {
            if (state.v.x === 0) {
                state.v = {x: v.y, y: 0};
            } else {
                state.v = {x: 0, y: -v.x};
            }
        } else if (state.decision === LEFT) {
            if (state.v.x === 0) {
                state.v = {x: -v.y, y: 0};
            } else {
                state.v = {x: 0, y: v.x};
            }
        }
}