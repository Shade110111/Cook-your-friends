let player1 = {x:508,y:512,dx:0,dy:0}
let player2 = {x:516,y:512,dx:0,dy:0}
let camera = {x:0,y:0,sw:0,sh:0}
let move_speed = 2 //move speed is absolute units



function preload(){
  level = loadImage('Level.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();
}

function windowResized() {
  resizeCanvas(windowWidth,windowHeight);
}

function diff(a,b){ //quickly find the difference between two values
  return Math.abs(a-b);
}

function pickup(player_number){

}

function drop(player_number){
  
}

function draw() {
  //reset delta values
  player1.dx = 0
  player1.dy = 0
  player2.dx = 0
  player2.dy = 0

  //get inputs
  if (keyIsPressed == true){
    if (keyIsDown(65)) {player1.dx -= move_speed}; //65 is keycode for a
    if (keyIsDown(68)) {player1.dx += move_speed}; //68 is keycode for d
    if (keyIsDown(87)) {player1.dy -= move_speed}; //87 is keycode for w
    if (keyIsDown(83)) {player1.dy += move_speed}; //83 is keycode for s
    if (keyIsDown(67)) {pickup(1)}; //67 is keycode for c
    if (keyIsDown(88)) {drop(1)}; //88 is keycode for x
    if (keyIsDown(LEFT_ARROW)) {player2.dx -= move_speed};
    if (keyIsDown(RIGHT_ARROW)) {player2.dx += move_speed};
    if (keyIsDown(UP_ARROW)) {player2.dy -= move_speed};
    if (keyIsDown(DOWN_ARROW)) {player2.dy += move_speed};
    if (keyIsDown(191)) {pickup(2)}; //191 is keycode for /
    if (keyIsDown(190)) {drop(2)}; //190 is keycode for .
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

  //find camera zoom
  camera.sw = diff(player1.x,player2.x)+windowWidth/5
  camera.sh = diff(player1.y,player2.y)+windowHeight/5
  //reset larger of two camera zooms
  if (camera.sw/windowWidth > camera.sh/windowHeight){
    camera.sh = camera.sw/windowWidth*windowHeight
  }
  else{
    camera.sw = camera.sh/windowHeight*windowWidth
  }


  //find camera position (top left)
  camera.x = ((player1.x+player2.x)/2)-camera.sw/2
  camera.y = ((player1.y+player2.y)/2)-camera.sh/2

  //render
  background(220);
  image(level,0,0,windowWidth,windowHeight,camera.x,camera.y,camera.sw,camera.sh,CONTAIN)
  
  if (player1.y < player2.y){
    circle(((player1.x-camera.x)/camera.sw)*windowWidth,((player1.y-camera.y)/camera.sh)*windowHeight,30)
    circle(((player2.x-camera.x)/camera.sw)*windowWidth,((player2.y-camera.y)/camera.sh)*windowHeight,30)
  }
  else{
    circle(((player2.x-camera.x)/camera.sw)*windowWidth,((player2.y-camera.y)/camera.sh)*windowHeight,30)
    circle(((player1.x-camera.x)/camera.sw)*windowWidth,((player1.y-camera.y)/camera.sh)*windowHeight,30)
  }
}
