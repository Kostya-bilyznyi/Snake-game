const canvas = document.querySelector('#etch-a-sketch');
const ctx = canvas.getContext("2d");
const startButton = document.querySelector('button.start');
const scoreElement = document.querySelector('.score__number');
const resultPopup = document.querySelector('.result-popup');
const resultScore = document.querySelector('.result-popup .result-popup__score');
const resultClose = document.querySelector('.result-popup .result-popup__close');
let xCordBody, interval, xCordApple, yCordApple, score, dataSpeed;
const moveAmount = 20;
let speed = 400;
let color = 0;
let direction = 'ArrowRight';
let cordArray = [];
ctx.strokeStyle = `hsl(${color}, 100%, 50%)`;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = moveAmount;

const xStartCordTail = Math.round( (canvas.width - 20) / 2 - 100);
let yCordBody = yStartCordTail = Math.round((canvas.height - 20) / 2);
let xHeadCord = xStartHeadCord = Math.round( (canvas.width - 20) / 2);
let yHeadCord = yStartHeadCord = Math.round((canvas.height - 20) / 2);

createStartCordArray();
drawSnake();
appleCords();
drawApple(xCordApple, yCordApple);

function addScore() {
    score = parseInt(scoreElement.innerText);
    dataSpeed = parseInt(scoreElement.dataset.speed);
    dataSpeed++;
    score = score + 10 + dataSpeed;
    scoreElement.dataset.speed = dataSpeed;
    scoreElement.innerHTML = score;
}
function appleCords() {
    xCordApple = roundTo20( Math.round(Math.random() * (canvas.width - 20)), 20, 10);
    yCordApple = roundTo20( Math.round(Math.random() * (canvas.height - 20)), 20, 10);

    if(cordArray.some(item => item.xCordBody === xCordApple && item.yCordBody === yCordApple)) appleCords();
}
function roundTo20(number, increment, offset) {
    return Math.ceil((number - offset) / increment ) * increment + offset;
}
function drawSnake() {
    for (const cord of cordArray) {
        ctx.beginPath();
        ctx.moveTo(cord.xCordBody, cord.yCordBody);
        ctx.lineTo(cord.xCordBody, cord.yCordBody);
        ctx.stroke();
    }
}
function createStartCordArray() {
    for (let xCordBody = xStartCordTail; xCordBody <= xStartHeadCord; xCordBody += moveAmount) {
        cordArray.push({xCordBody, yCordBody});
    }
}
function gameOver() {
    direction = 'ArrowRight';
    yCordBody = yStartCordTail;
    cordArray = [];
    ctx.strokeStyle = `hsl(${color}, 100%, 50%)`;
    xHeadCord = xStartHeadCord;
    yHeadCord = yStartHeadCord;
    speed = 400;
    clearCanvas();
    createStartCordArray();
    drawSnake();
    drawApple(xCordApple, yCordApple);
    clearInterval(interval);
    showResults()

    startButton.classList.remove('hidden');
    canvas.classList.add('shake');
}
function showResults() {
    resultScore.innerText = score;
    resultPopup.classList.add('show');
}
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function removeClassFromCanvas() {
    canvas.classList.remove('shake');
}
function moveSnake() {

    switch(direction) {
        case 'ArrowUp':
            if(yHeadCord <= 20) {
                yHeadCord = 20;
                gameOver();
                return;
            }
            yHeadCord -= moveAmount;
            break;
        case 'ArrowDown':
            if(yHeadCord >= (canvas.height - 20)) {
                yHeadCord = (canvas.height - 20);
                gameOver();
                return;
            }
            yHeadCord += moveAmount;
            break;
        case 'ArrowLeft':
            if(xHeadCord <= 20) {
                xHeadCord = 20;
                gameOver();
                return;
            }
            xHeadCord -= moveAmount;
            break;
        default:
            if(xHeadCord >= (canvas.width - 20)) {
                xHeadCord = (canvas.width - 20);
                gameOver();
                return;
            }
            xHeadCord += moveAmount;
    }

    xCordBody = xHeadCord;
    yCordBody = yHeadCord;

    if(cordArray.some(item => item.xCordBody === xHeadCord && item.yCordBody === yHeadCord)) {
        gameOver();
        return;
    }

    cordArray.push({xCordBody, yCordBody});

    if(xHeadCord === xCordApple && yHeadCord === yCordApple) {
        appleCords();
        if (speed !== 10) speed -= 10;

        clearInterval(interval);
        interval = setInterval( moveSnake, speed);

        addScore();

    } else {
        cordArray.shift();
    }

    color += 1;
    ctx.strokeStyle = `hsl(${color}, 100%, 50%)`;

    clearCanvas();
    drawSnake();
    drawApple(xCordApple, yCordApple);

}
function startGame() {
    this.classList.add('hidden');
    closePopup();
    interval = setInterval( moveSnake, speed);
}
function drawApple(xCordApple, yCordApple) {
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(xCordApple, yCordApple);
    ctx.lineTo(xCordApple, yCordApple);
    ctx.stroke();
}
function determineDirection({key}) {
    if (!key.includes('Arrow')) return;

    switch(key) {
        case 'ArrowUp':
            if(direction === 'ArrowDown') return;
            break;
        case 'ArrowDown':
            if(direction === 'ArrowUp') return;
            break;
        case 'ArrowLeft':
            if(direction === 'ArrowRight') return;
            break;
        default:
            if(direction === 'ArrowLeft') return;
    }

    direction = key;
}
function closePopup() {
    scoreElement.dataset.speed = 0;
    scoreElement.innerHTML = 0;
    score = 0;
    if (resultPopup.classList.contains('show')) resultPopup.classList.remove('show');
}

document.addEventListener('keydown', determineDirection);
startButton.addEventListener('click', startGame);
resultClose.addEventListener('click', closePopup);
canvas.addEventListener( 'animationend', removeClassFromCanvas);
