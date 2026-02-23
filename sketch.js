let player1 = {x:400,y:512,dx:0,dy:0,colliding_flag:false,nearest_collision_circle:[0,0],circle_distance:0,circle_smallest_distance:9999,item:"none"}
let player2 = {x:624,y:512,dx:0,dy:0,colliding_flag:false,nearest_collision_circle:[0,0],circle_distance:0,circle_smallest_distance:9999,item:"none"}
let camera = {x:200,y:200,sw:0,sh:0} //sw = absoulte window width, sh = absoulte window height
let move_speed = 1.4 //move speed is absolute units
let corridor_width = 26



function preload(){
  level = loadImage('Level.png');
  controls = loadImage('controls.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();
  frameRate(60);
  strokeWeight(1);
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

function make_corridor(x1,y1,x2,y2){ //x1,y1 are one end of the corridor, x2,y2 are the other end
  segment_length = sqrt((diff(x1,x2)^2)+(diff(y1,y2)^2)) //find length of line segment (corridor)
  segment_length = int(segment_length) //make int
  x2 -= x1
  y2 -= y1 //x2 and y2 are now relative displacement from x1 and y1
  x2 = x2 / segment_length
  y2 = y2 / segment_length //x2 and y2 are now relative displacement to the first of many circles that will make up the corridor
  //initialise smallest distance
  for (let i = segment_length;i>-1;i-=1){
    //render circles (testing)
    circle(absolute_to_local_x(x1+x2*i),absolute_to_local_y(y1+y2*i),absolute_to_local_w(corridor_width))
    //find distances to circles
    player1.circle_distance = sqrt(sq(abs(player1.x-(x1+x2*i)))+sq(abs(player1.y-(y1+y2*i))))
    player2.circle_distance = sqrt(sq(abs(player2.x-(x1+x2*i)))+sq(abs(player2.y-(y1+y2*i))))

    if (player1.circle_distance > corridor_width/2){
      if (player1.circle_distance < player1.circle_smallest_distance){ 
        player1.circle_smallest_distance = player1.circle_distance
        player1.nearest_collision_circle = [x1+x2*i,y1+y2*i] //output: circle to move towards
      }
    }
    else{
      player1.colliding_flag = true //colliding if within corridor
    }
    if (player2.circle_distance > corridor_width/2){
      if (player2.circle_distance < player2.circle_smallest_distance){ 
        player2.circle_smallest_distance = player2.circle_distance
        player2.nearest_collision_circle = [x1+x2*i,y1+y2*i] //output: circle to move towards
      }
    }
    else{
      player2.colliding_flag = true //colliding if within corridor
    }
  }
}

function collision(){
    //alter delta values to keep players within the corridor
  if (player1.colliding_flag == false){ //colliding if within corridor, if not move player back in
    player1.dx = player1.dx + ((player1.nearest_collision_circle[0]-player1.x)/12)
    player1.dy = player1.dy + ((player1.nearest_collision_circle[1]-player1.y)/12)
  }
  if (player2.colliding_flag == false){ //colliding if within corridor, if not move player back in
    player2.dx = player2.dx + ((player2.nearest_collision_circle[0]-player2.x)/12)
    player2.dy = player2.dy + ((player2.nearest_collision_circle[1]-player2.y)/12)
  }
}
//!!!!!!!!!!note remember to not check circles far away

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
  player1.colliding_flag = false //if true you have left the level (yes I know this is backwards)
  player2.colliding_flag = false
  player1.circle_smallest_distance = 9999
  player2.circle_smallest_distance = 9999

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

  //nw segment
  make_corridor(452,500,417,447);
  make_corridor(385,460,370,475);
  make_corridor(387,443,345,475);
  make_corridor(355,475,360,475);
  make_corridor(403,450,465,427);
  make_corridor(473,426,520,426);
  //main section
  corridor_width = 70 //corridor widths larger than 26 are buggy and so should not be used for collision, only as a shape that you can walk in
  make_corridor(470,535,545,535);
  corridor_width = 26
  make_corridor(465,502,500,500);
  make_corridor(510,500,550,510);
  make_corridor(560,512,584,530);
  make_corridor(586,535,586,550);
  make_corridor(583,557,560,570);
  make_corridor(553,573,505,577);
  make_corridor(500,577,460,568);
  make_corridor(455,568,435,545);
  make_corridor(433,540,433,530);
  make_corridor(437,527,448,515);

  collision() //finally applies delta changes

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

  //visualise collision shapes, comment this out later as it is just for testing
  fill(240,240,255);
  //nw segment
  make_corridor(452,500,417,447);
  make_corridor(385,460,370,475);
  make_corridor(387,443,345,475);
  make_corridor(355,475,360,475);
  make_corridor(403,450,465,427);
  make_corridor(473,426,520,426);
  //main section
  corridor_width = 70 //corridor widths larger than 26 are buggy and so should not be used for collision, only as a shape that you can walk in
  make_corridor(470,535,545,535);
  corridor_width = 26
  make_corridor(465,502,500,500);
  make_corridor(510,500,550,510);
  make_corridor(560,512,584,530);
  make_corridor(586,535,586,550);
  make_corridor(583,557,560,570);
  make_corridor(553,573,505,577);
  make_corridor(500,577,460,568);
  make_corridor(455,568,435,545);
  make_corridor(433,540,433,530);
  make_corridor(437,527,448,515);
  



  

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

}
