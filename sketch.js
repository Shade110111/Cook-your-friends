let player1 = {x:500,y:500}
let player2 = {x:0,y:0}

function setup() {
  createCanvas(windowWidth, windowHeight);
  unit = (windowWidth+windowHeight)/2 //unit is the average of the height and width of the screen, use it for all scaling and co-ordinates.
}
function windowResized() {
  resizeCanvas(windowWidth,windowHeight);
  unit = (windowWidth+windowHeight)/2
}



function draw() {
  background(220);
  circle(player1.x,player1.y,unit/6)
}

