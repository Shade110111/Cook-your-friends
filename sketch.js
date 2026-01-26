let player1 = {x:0,y:0}
let player2 = {x:0,y:0}
let camera = {x:0,y:0}

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
  
  if (keyIsPressed == true){
    if (keyIsDown(a)) {player1.x -= unit/400};
    if (keyIsDown(d)) {player1.x += unit/400};
    if (keyIsDown(LEFT_ARROW)) {player2.x -= unit/400};
    if (keyIsDown(RIGHT_ARROW)) {player2.x += unit/400};
  }

  //render
  circle(player1.x,player1.y,unit/6)
  circle(player2.x,player2.y,unit/6)
}

