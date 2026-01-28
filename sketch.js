let player1 = {x:0,y:0,dx:0,dy:0}
let player2 = {x:0,y:0,dx:0,dy:0}
let camera = {x:0,y:0}
let move_speed = 300 //move speed is expressed as a fraction of the entire screen per frame so a speed of 4 would take 4 seconds to cross the screen

function preload(){
  img = loadImage('Home1.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  unit = (windowWidth+windowHeight)/2 //unit is the average of the height and width of the screen, use it for all scaling and co-ordinates.
  player1 = {x:0.5*unit,y:0.5*unit}
  player2 = {x:0.5*unit,y:0.5*unit}
  noSmooth();
}
function windowResized() {
  resizeCanvas(windowWidth,windowHeight);
  unit = (windowWidth+windowHeight)/2
}

function draw() {
  background(220);
  image(img,0+camera.x,0+camera.y,unit,unit);
  
  //reset delta values
  player1.dx = 0
  player1.dy = 0
  player2.dx = 0
  player2.dy = 0

  //get inputs
  if (keyIsPressed == true){
    if (keyIsDown(65)) {player1.dx -= unit/move_speed}; //65 is keycode for a
    if (keyIsDown(68)) {player1.dx += unit/move_speed}; //68 is keycode for d
    if (keyIsDown(87)) {player1.dy -= unit/move_speed}; //87 is keycode for w
    if (keyIsDown(83)) {player1.dy += unit/move_speed}; //83 is keycode for s
    if (keyIsDown(LEFT_ARROW)) {player2.dx -= unit/move_speed};
    if (keyIsDown(RIGHT_ARROW)) {player2.dx += unit/move_speed};
    if (keyIsDown(UP_ARROW)) {player2.dy -= unit/move_speed};
    if (keyIsDown(DOWN_ARROW)) {player2.dy += unit/move_speed};
  }

  //normalise movement
  if (player1.dx != 0 && player1.dy != 0){
    player1.dx = player1.dx/1.414214 //1.414214 is the square root of 2, this normalises diagonal movement
    player1.dy = player1.dy/1.414214
  }
  if (player2.dx != 0 && player2.dy != 0){
    player2.dx = player2.dx/1.414214 //1.414214 is the square root of 2, this normalises diagonal movement
    player2.dy = player2.dy/1.414214
  }

  //collision

  //add delta to position
  player1.x += player1.dx
  player1.y += player1.dy
  player2.x += player2.dx
  player2.y += player2.dy

  //render
  if (player1.y < player2.y){
    circle(player1.x,player1.y,unit/12)
    circle(player2.x,player2.y,unit/12)
  }
  else{
    circle(player2.x,player2.y,unit/12)
    circle(player1.x,player1.y,unit/12)

  }
}

