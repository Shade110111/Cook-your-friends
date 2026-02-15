let player1 = {x:400,y:512,dx:0,dy:0,item:"none"}
let player2 = {x:624,y:512,dx:0,dy:0,item:"none"}
let camera = {x:200,y:200,sw:0,sh:0} //sw = absoulte window width, sh = absoulte window height
let move_speed = 1.4 //move speed is absolute units



function preload(){
  level = loadImage('level_lineart.png');
  controls = loadImage('controls.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();
  frameRate(60);
}

function windowResized() {
  resizeCanvas(windowWidth,windowHeight);
}

function diff(a,b){ //quickly find the difference between two values
  return Math.abs(a-b);
}

//convert absolute coordinate values into their camera relative equivalent
function absolute_to_local_x(x){
  return (((x-camera.x)/camera.sw)*windowWidth)
}

function absolute_to_local_y(y){
  return (((y-camera.y)/camera.sh)*windowHeight)
}

function absolute_to_local_w(w){
  return (w/camera.sw*windowWidth)
}

function absolute_to_local_h(h){
  return (h/camera.sh*windowHeight)
}

function pickup(player_number){
//if holding something drop it
//add item to inventory
//remove item from level
}

function drop(player_number){
  //if near workstation use workstation and lose item
  //if else drop item and remove from inventory
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
  camera.sw = 0.8*camera.sw + (diff(player1.x,player2.x)+windowWidth/5)*0.2 //multiply is for smoothing
  camera.sh = 0.8*camera.sh + (diff(player1.y,player2.y)+windowHeight/5)*0.2 //multiply is for smoothing
  //reset larger of two camera zooms
  if (camera.sw/windowWidth > camera.sh/windowHeight){
    camera.sh = camera.sw/windowWidth*windowHeight
  }
  else{
    camera.sw = camera.sh/windowHeight*windowWidth
  }


  //find camera position (top left)
  camera.x = 0.8*camera.x + (((player1.x+player2.x)/2)-camera.sw/2)*0.2 //multiply is for smoothing
  camera.y = 0.8*camera.y + (((player1.y+player2.y)/2)-camera.sh/2)*0.2 //multiply is for smoothing

  //render level
  background(220);
  image(level,0,0,windowWidth,windowHeight,camera.x,camera.y,camera.sw,camera.sh,CONTAIN)

  //visualise collision shapes
  fill(240,240,255);
  circle(absolute_to_local_x(470),absolute_to_local_y(535),absolute_to_local_w(100))
  circle(absolute_to_local_x(540),absolute_to_local_y(535),absolute_to_local_w(100))
  circle(absolute_to_local_x(510),absolute_to_local_y(535),absolute_to_local_w(110))
  //NW ramp
  circle(absolute_to_local_x(450),absolute_to_local_y(500),absolute_to_local_w(40))
  circle(absolute_to_local_x(440),absolute_to_local_y(482),absolute_to_local_w(40))
  circle(absolute_to_local_x(429),absolute_to_local_y(465),absolute_to_local_w(40))
  //sw ramp
  circle(absolute_to_local_x(420),absolute_to_local_y(580),absolute_to_local_w(40))

  //render players
  fill(255,255,255);
  if (player1.y < player2.y){
    circle(absolute_to_local_x(player1.x),absolute_to_local_y(player1.y),absolute_to_local_w(15));
    circle(absolute_to_local_x(player2.x),absolute_to_local_y(player2.y),absolute_to_local_w(15));
  }
  else{
    circle(absolute_to_local_x(player2.x),absolute_to_local_y(player2.y),absolute_to_local_w(15));
    circle(absolute_to_local_x(player1.x),absolute_to_local_y(player1.y),absolute_to_local_w(15));
  }
 
  //render controls
  fill(0,0,0);
  rect(0,windowHeight-16,windowWidth,16);
  image(controls,0,windowHeight-16,controls.width/2,controls.height/2);

  //testing text
  fill('tomato');
  textSize(32);
  text('colliding',20,60);
}
