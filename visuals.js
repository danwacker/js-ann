//file for visual functions

//color pallette for game
const board_border = 'black';
const board_background = 'white';
const snake_col = 'lightblue';
const snake_border = 'darkblue';
const food_col = 'red';
const food_border = 'yellow';

//exported complete draw function
export function draw(canv,state) {
    clearBoard(canv);
    drawSnake(canv,state.snake);
    drawFood(canv,state.food);
}

//resets board
function clearBoard(canv) {
    canv.fillStyle = board_background;
    canv.strokeStyle = board_border;
    canv.fillRect(0, 0, 400, 400);
    canv.strokeRect(0, 0, 400, 400);
}

//draws complete snake
function drawSnake(canv, snake) {
    for (let i=0; i<snake.length; i++) {
        drawSnakePart(canv,snake[i]);
    }
}

//draws piece of snake
function drawSnakePart(canv, snakePart) {
    canv.fillStyle = snake_col;
    canv.strokestyle = snake_border;
    canv.fillRect(snakePart.x, snakePart.y, 10, 10);
    canv.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

//draws snake food
function drawFood(canv, food) {
    canv.fillStyle = food_col;
    canv.strokestyle = food_border;
    canv.fillRect(food.x, food.y, 10, 10);
    canv.strokeRect(food.x, food.y, 10, 10);
}
