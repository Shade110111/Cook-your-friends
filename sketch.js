let player1 = {x:400,y:512,dx:0,dy:0,colliding_flag:false,nearest_collision_circle:[0,0],circle_distance:0,circle_smallest_distance:9999,sprite:"front",item:"none",frame_counter:0,subframe_counter:0}
let player2 = {x:624,y:512,dx:0,dy:0,colliding_flag:false,nearest_collision_circle:[0,0],circle_distance:0,circle_smallest_distance:9999,sprite:"front",item:"none",frame_counter:0,subframe_counter:0}
let camera = {x:200,y:200,sw:0,sh:0} //sw = absoulte window width, sh = absoulte window height
let move_speed = 1.4 //move speed is absolute units
let corridor_width = 26
let grinder_timer = 6 //takes 5 seconds to grind

function preload(){
  level = loadImage('Level.png');
  level_overlay = loadImage('Level_overlay.png');
  controls = loadImage('controls.png');
  //player1-cubloaf
  player1_back = [loadImage('cubloaf_player/b1.png'),loadImage('cubloaf_player/b2.png'),loadImage('cubloaf_player/b3.png'),loadImage('cubloaf_player/b4.png')]
  player1_front = [loadImage('cubloaf_player/f1.png'),loadImage('cubloaf_player/f2.png'),loadImage('cubloaf_player/f3.png'),loadImage('cubloaf_player/f4.png')]
  player1_left = [loadImage('cubloaf_player/l1.png'),loadImage('cubloaf_player/l2.png'),loadImage('cubloaf_player/l3.png'),loadImage('cubloaf_player/l4.png')]
  player1_right = [loadImage('cubloaf_player/r1.png'),loadImage('cubloaf_player/r2.png'),loadImage('cubloaf_player/r3.png'),loadImage('cubloaf_player/r4.png')]
  //player2-sugarpop
  player2_back = [loadImage('sugarpop_player/b1.png'),loadImage('sugarpop_player/b2.png'),loadImage('sugarpop_player/b3.png'),loadImage('sugarpop_player/b4.png')]
  player2_front = [loadImage('sugarpop_player/f1.png'),loadImage('sugarpop_player/f2.png'),loadImage('sugarpop_player/f3.png'),loadImage('sugarpop_player/f4.png')]
  player2_left = [loadImage('sugarpop_player/l1.png'),loadImage('sugarpop_player/l2.png'),loadImage('sugarpop_player/l3.png'),loadImage('sugarpop_player/l4.png')]
  player2_right = [loadImage('sugarpop_player/r1.png'),loadImage('sugarpop_player/r2.png'),loadImage('sugarpop_player/r3.png'),loadImage('sugarpop_player/r4.png')]
  print("loaded images")
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

function render_player(x,y,w,player){
  if (player.dx == 0 && player.dy == 0){
    player.frame_counter = 0
    player.subframe_counter = 0
  }
  else{
    player.subframe_counter += 1
  }
  if (player.subframe_counter >= 10){ //after this many frames update the animation frame
    player.subframe_counter = 0
    player.frame_counter += 1
  }
  if (player.frame_counter >= 4){
    player.frame_counter = 0
  }
  
  if (player == player1){
    //check direction
    if (keyIsDown(83)){
      player1.sprite = "front"
    }
    else if (keyIsDown(87)){
      player1.sprite = "back"
    }
    else if (keyIsDown(68)){
      player1.sprite = "right"
    }
    else if (keyIsDown(65)){
      player1.sprite = "left"
    }

    //render player1
    if (player1.sprite == "front") {
      image(player1_front[player.frame_counter],x-w*1.5,y-w*2.5,w*3,w*3)
    }
    else if (player1.sprite == "back") {
      image(player1_back[player.frame_counter],x-w*1.5,y-w*2.5,w*3,w*3)
    }
    else if (player1.sprite == "right") {
      image(player1_right[player.frame_counter],x-w*1.5,y-w*2.5,w*3,w*3)
    }
    else if (player1.sprite == "left") {
      image(player1_left[player.frame_counter],x-w*1.5,y-w*2.5,w*3,w*3)
    }
  }
  if (player == player2){
    //check direction
    if (keyIsDown(DOWN_ARROW)){
      player2.sprite = "front"
    }
    else if (keyIsDown(UP_ARROW)){
      player2.sprite = "back"
    }
    else if (keyIsDown(RIGHT_ARROW)){
      player2.sprite = "right"
    }
    else if (keyIsDown(LEFT_ARROW)){
      player2.sprite = "left"
    }

    //render player2
    if (player2.sprite == "front") {
      image(player2_front[player.frame_counter],x-w*1.5,y-w*2.5,w*3,w*3)
    }
    else if (player2.sprite == "back") {
      image(player2_back[player.frame_counter],x-w*1.5,y-w*2.5,w*3,w*3)
    }
    else if (player2.sprite == "right") {
      image(player2_right[player.frame_counter],x-w*1.5,y-w*2.5,w*3,w*3)
    }
    else if (player2.sprite == "left") {
      image(player2_left[player.frame_counter],x-w*1.5,y-w*2.5,w*3,w*3)
    }
  }
}

function interact(player,x,y){
  //check trying to drop or pick up?
  if (player.item == "none"){
    //pickup checks
    if (sqrt(sq(abs(x-(442)))+sq(abs(y-(634))))<40/2){
      player.item = "nibbleaf"
    }
    else if (sqrt(sq(abs(x-(376)))+sq(abs(y-(590))))<30/2){
      player.item = "sugarpop"
    }
    else if (sqrt(sq(abs(x-(348)))+sq(abs(y-(600))))<30/2){
      player.item = "toastie"
    }
    else if (sqrt(sq(abs(x-(315)))+sq(abs(y-(610))))<40/2){
      player.item = "wailotte"
    }
    else if (sqrt(sq(abs(x-(410)))+sq(abs(y-(665))))<40/2){
      player.item = "cubloaf"
    }
    else if (sqrt(sq(abs(x-(564)))+sq(abs(y-(495))))<40/2){
      player.item = "input_grinder_output_here"
    }
  }
  else{
    //drop checks
    if (sqrt(sq(abs(x-(405)))+sq(abs(y-(555))))<40/2){
      //bin
      player.item = "none"
    }
    else if (sqrt(sq(abs(x-(332)))+sq(abs(y-(486))))<30/2){
      //chopping board 1
      player.item = "input_chopping_output_here"
    }
    else if (sqrt(sq(abs(x-(362)))+sq(abs(y-(486))))<30/2){
      //chopping board 2
      player.item = "input_chopping_output_here"
    }
    else if (sqrt(sq(abs(x-(532)))+sq(abs(y-(427))))<40/2){
      //grinder input
      grind(player.item)
      player.item = "none"
    }
    else if (sqrt(sq(abs(x-(491)))+sq(abs(y-(588))))<30/2){
      //hob 1
      player.item = "input_hob_output_here"
    }
    else if (sqrt(sq(abs(x-(521)))+sq(abs(y-(586))))<30/2){
      //hob 2
      player.item = "input_hob_output_here"
    }
    else if (sqrt(sq(abs(x-(491)))+sq(abs(y-(588))))<40/2){
      //till
      player.item = "none"
    }
  }
  print(player.item)
}

function grind(input_item){
  grinder_timer = 0
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

  //incriment counters
  if (grinder_timer <5)
    grinder_timer += 1/60
  //process grinder
  if grinder

  //get movement inputs
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

  //nw section
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
  make_corridor(435,565,422,570);
  make_corridor(433,540,433,530);
  make_corridor(437,527,448,515);
  //E section
  make_corridor(600,552,640,547);
  make_corridor(646,547,637,575);
  make_corridor(630,585,600,564);
  make_corridor(630,560,630,560);
  //SW section
  make_corridor(435,570,425,580);
  make_corridor(420,585,396,620);
  make_corridor(370,610,435,655);
  make_corridor(433,660,380,640);
  make_corridor(365,640,353,652);
  make_corridor(353,652,317,620);
  make_corridor(317,620,360,611);
  make_corridor(355,630,380,625);

  collision() //finally applies delta changes

  //add delta to position
  player1.x += player1.dx
  player1.y += player1.dy
  player2.x += player2.dx
  player2.y += player2.dy

  //get interact inputs
  if (keyIsPressed == true){
    if (keyIsDown(67)) {interact(player1,player1.x,player1.y)}; //67 is keycode for c
    if (keyIsDown(190)) {interact(player2,player2.x,player2.y)}; //190 is keycode for .
  }

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
  background(240,204,133);
  image(level,0,0,windowWidth,windowHeight,camera.x,camera.y,camera.sw,camera.sh,CONTAIN)

  //visualise collision shapes, comment this out later as it is just for testing
  fill(240,240,255);
  /*
  //nw section
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
  make_corridor(435,565,422,570);
  make_corridor(433,540,433,530);
  make_corridor(437,527,448,515);
  //E section
  make_corridor(600,552,640,547);
  make_corridor(646,547,637,575);
  make_corridor(630,585,600,564);
  make_corridor(630,560,630,560);
  //SW section
  make_corridor(435,570,425,580);
  make_corridor(420,585,396,620);
  make_corridor(370,610,435,655);
  make_corridor(433,660,380,640);
  make_corridor(365,640,353,652);
  make_corridor(353,652,317,620);
  make_corridor(317,620,360,611);
  make_corridor(355,630,380,625);
  */


  //render players
  fill(255,255,255);
  if (player1.y < player2.y){
    //circle(absolute_to_local_x(player1.x),absolute_to_local_y(player1.y),absolute_to_local_w(15));
    render_player(absolute_to_local_x(player1.x),absolute_to_local_y(player1.y),absolute_to_local_w(15),player1);
    //circle(absolute_to_local_x(player2.x),absolute_to_local_y(player2.y),absolute_to_local_w(15));
    render_player(absolute_to_local_x(player2.x),absolute_to_local_y(player2.y),absolute_to_local_w(15),player2);
  }
  else{
    //circle(absolute_to_local_x(player2.x),absolute_to_local_y(player2.y),absolute_to_local_w(15));
    render_player(absolute_to_local_x(player2.x),absolute_to_local_y(player2.y),absolute_to_local_w(15),player2);
    //circle(absolute_to_local_x(player1.x),absolute_to_local_y(player1.y),absolute_to_local_w(15));
    render_player(absolute_to_local_x(player1.x),absolute_to_local_y(player1.y),absolute_to_local_w(15),player1);
  }
 //render level overlay
 image(level_overlay,0,0,windowWidth,windowHeight,camera.x,camera.y,camera.sw,camera.sh,CONTAIN)


  //render controls
  fill(0,0,0);
  rect(0,windowHeight-32,windowWidth,32);
  image(controls,0,windowHeight-32,controls.width,controls.height);

  //visualise interact zones for testing
  fill(0,0,0,0)
  //bin
  circle(absolute_to_local_x(405),absolute_to_local_y(555),absolute_to_local_w(40));
  //nibbleaf
  circle(absolute_to_local_x(442),absolute_to_local_y(634),absolute_to_local_w(40));
  //sugarpop
  circle(absolute_to_local_x(376),absolute_to_local_y(590),absolute_to_local_w(30));
  //toastie
  circle(absolute_to_local_x(348),absolute_to_local_y(600),absolute_to_local_w(30));
  //wailottes
  circle(absolute_to_local_x(315),absolute_to_local_y(610),absolute_to_local_w(40));
  //cubloafs
  circle(absolute_to_local_x(410),absolute_to_local_y(665),absolute_to_local_w(40));
  //chopping board 1
  circle(absolute_to_local_x(332),absolute_to_local_y(486),absolute_to_local_w(30));
  //chopping board 2
  circle(absolute_to_local_x(362),absolute_to_local_y(486),absolute_to_local_w(30));
  //grinder input
  circle(absolute_to_local_x(532),absolute_to_local_y(427),absolute_to_local_w(40));
  //grinder output
  circle(absolute_to_local_x(564),absolute_to_local_y(495),absolute_to_local_w(40));
  //hob 1
  circle(absolute_to_local_x(491),absolute_to_local_y(588),absolute_to_local_w(30));
  //hob 2
  circle(absolute_to_local_x(521),absolute_to_local_y(586),absolute_to_local_w(30));
  //till
  circle(absolute_to_local_x(667),absolute_to_local_y(552),absolute_to_local_w(40));
}
