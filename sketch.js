let player1 = {x:0,y:0,dx:0,dy:0}
let player2 = {x:0,y:0,dx:0,dy:0}
let camera = {x:0,y:0,zoom:0}
let move_speed = 10 //move speed is absolute units
let unit //square real screen
let unit_offset = {x:0,y:0}
let level_data = {side:1200}

function preload(){
  level = loadImage('Home1.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  unit = (windowWidth+windowHeight)/2 //unit is the average of the height and width of the screen, use it for all scaling and co-ordinates.
  unit_offset.x = (windowWidth-unit)/2
  unit_offset.y = (windowHeight-unit)/2
  player1 = {x:unit/2,y:+unit/2}
  player2 = {x:+unit/2,y:+unit/2}
  noSmooth();
}
function windowResized() {
  resizeCanvas(windowWidth,windowHeight);
  old_unit = unit
  unit = (windowWidth+windowHeight)/2 //unit is the average of the height and width of the screen, use it for all scaling and co-ordinates.
  unit_offset.x = (windowWidth-unit)/2
  unit_offset.y = (windowHeight-unit)/2
}

function diff(a,b){
  return Math.abs(a-b);
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
    if (keyIsDown(LEFT_ARROW)) {player2.dx -= move_speed};
    if (keyIsDown(RIGHT_ARROW)) {player2.dx += move_speed};
    if (keyIsDown(UP_ARROW)) {player2.dy -= move_speed};
    if (keyIsDown(DOWN_ARROW)) {player2.dy += move_speed};
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

  //find camera position
  camera.x = (player1.x+player2.x)/2
  camera.y = (player1.y+player2.y)/2

  //find camera zoom
  if (diff(player1.x,player2.x) > diff(player1.y,player2.y)){
    camera.zoom = diff(player1.x,player2.x)
    print("x")
  }
  else {
    camera.zoom = diff(player1.y,player2.y)
    print("y")
  }
  //zoom is the largest distance in x or y between players
  camera.zoom += 0.5*unit //add some space on the sides
  //zoom effectively replaces unit


//note: zoom working so now jus fix render to work with it and new absolute values

  //render
  background(220);
  image(level,0,0,windowWidth,windowHeight,camera.x-camera.zoom/2,camera.y-camera.zoom/2,width,height,CONTAIN)
  //image(level,(-(camera.x-0.5*camera.zoom)),(-(camera.y-0.5*camera.zoom)),camera.zoom,camera.zoom) //-0.5 unit becuase the camera co-ords are for the middle but the image is drawn from the top left, negate because the image moves against the cameras movements
  print(zoom)
  if (player1.y < player2.y){
    circle(player1.x,player1.y)

    circle(player1.x-camera.x+unit_offset.x,player1.y-camera.y+unit_offset.y,unit/12)
    circle(player2.x-camera.x+unit_offset.x,player2.y-camera.y+unit_offset.y,unit/12)
  }
  else{
    

  }
}
