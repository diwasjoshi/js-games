const OBS_MAXWIDTH = 60, OBS_MINWIDTH = 50;
const OBS_MAXHEIGHT = 800, OBS_MINHEIGHT = 150;
const OBS_MAXGAP = 15, OBS_MINGAP = 300;
var gameSpeed = 5;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var copterImage = new Image();
var imgSrc = "assets/copter.png";
var shiftX = 175, shiftY = 110, frameWidth = 40, frameHeight = 30,
    posX = 0, posY = canvas.height/2, imageWidth = 80, imageHeight = 70;
var obstacles = [];
var gameTimeout;
var score = 0;
function drawCopter() {
    copterImage.src = imgSrc;
    ctx.drawImage(copterImage, shiftX, shiftY, frameWidth, frameHeight,
                  posX, posY, imageWidth, imageHeight);
}

function clearCanvas(x, y, width, height){
    ctx.clearRect(x,y,width,height);
}
function makeObstacle(x, y, width, height){
    var obs = {
        posX : x,
        posY : y,
        width : width,
        height : height
    };
    ctx.fillStyle = "#00CC00";
    ctx.fillRect(x, y, width, height);

    return obs;
}
function getRandomObstableDimensions(){
     return {
            width : Math.random() * (OBS_MAXWIDTH - OBS_MINWIDTH + 1) + OBS_MINWIDTH,
            height : Math.random() * (OBS_MAXHEIGHT - OBS_MINHEIGHT + 1) + OBS_MINHEIGHT
     };
}
function gameOver(){
    canvas.removeEventListener("mousemove", copterMove);
    clearCanvas(0,0,canvas.width,canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "#00CC00";
    ctx.fillText("Game Over!",canvas.width/2 - 100,canvas.height/2);
    ctx.fillText("Score: " + score,canvas.width/2 - 100,canvas.height/2 + 50);
}
function checkCrash(){
    var copterLeft = posX, copterRight = posX + imageWidth,
        copterTop = posY, copterBottom = posY + imageHeight;
    var obstacleLeft= obstacleRight= obstacleTop= obstacleBottom= 0;
    for (var i = 0; i < obstacles.length; i++) {
        obstacleLeft = obstacles[i].posX;
        obstacleRight = obstacles[i].posX + obstacles[i].width;
        obstacleTop = obstacles[i].posY;
        obstacleBottom = obstacles[i].posY + obstacles[i].height;
        if (copterRight >= obstacleLeft && copterLeft <= obstacleRight &&
            copterBottom >= obstacleTop && copterTop <= obstacleBottom){
                gameOver();
                return true;
            }
    }
}
function updateGame(){
    var updatedObstacles = [];
    if (obstacles.length === 0){
        var dimensions = getRandomObstableDimensions();
        updatedObstacles.push(makeObstacle(canvas.width - dimensions.width, 0, dimensions.width, dimensions.height));
    } else {
        for(var i=0; i<obstacles.length; i++){
            clearCanvas(obstacles[i].posX, obstacles[i].posY-1,
                        obstacles[i].width, obstacles[i].height+5);
            if (obstacles[i].posX - gameSpeed > 0){
                updatedObstacles.push(makeObstacle(obstacles[i].posX - gameSpeed, obstacles[i].posY,
                                    obstacles[i].width, obstacles[i].height));
            }
        }
    }

    if (canvas.width - updatedObstacles[updatedObstacles.length - 1].posX > OBS_MINGAP){
        var dimensions = getRandomObstableDimensions();
        if (Math.floor(Math.random() * 10) % 2 === 0){
            updatedObstacles.push(makeObstacle(canvas.width - dimensions.width, 0, dimensions.width, dimensions.height));
        } else {
            updatedObstacles.push(makeObstacle(canvas.width - dimensions.width, canvas.height - dimensions.height,
                                dimensions.width, dimensions.height));
        }
    }
    obstacles = updatedObstacles.slice();
    if (checkCrash()){
        return;
    }
    score++;
    gameTimeout =  setTimeout(updateGame, 20);
}
function copterMove(event){
    var x,y;
    if (event.x != undefined && event.y != undefined)
    {
      x = event.x;
      y = event.y;
    }
    else // Firefox method to get the position
    {
      x = event.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
      y = event.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
    }
    clearCanvas(posX,posY,imageWidth, imageHeight);
    posX = x - canvas.offsetLeft;
    posY = y - canvas.offsetTop;
    drawCopter();
}
canvas.addEventListener("mousemove", copterMove);
clearCanvas(0,0,canvas.width,canvas.height);
drawCopter();
updateGame();
