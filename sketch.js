let player1 = {x:400,y:512,dx:0,dy:0,colliding_flag:false,nearest_collision_circle:[0,0],circle_distance:0,circle_smallest_distance:9999,sprite:"front",item:"diced_toastie",frame_counter:0,subframe_counter:0,freeze: false}
let player2 = {x:624,y:512,dx:0,dy:0,colliding_flag:false,nearest_collision_circle:[0,0],circle_distance:0,circle_smallest_distance:9999,sprite:"front",item:"none",frame_counter:0,subframe_counter:0, freeze: false}
let camera = {x:200,y:200,sw:0,sh:0} //sw = absoulte window width, sh = absoulte window height
let move_speed = 1.4 //move speed is absolute units
let corridor_width = 26
let grinder = {timer:0,item:"none",state:"ready"}//state can be ready, processing or done
let board1 = {timer:0,item:"none",state:"ready",player:player2}//state can be ready, processing or done
let board2 = {timer:0,item:"none",state:"ready",player:player2}//state can be ready or processing
let stove1 = {timer:0,item:"none",state:"ready",player:player2}//state can be ready or processing
let stove2 = {timer:0,item:"none",state:"ready",player:player2}//state can be ready or processing
let grind_or_choppable_list = ["wailotte","toastie","sugarpop","nibbleaf","cubloaf"];
let cookable_list = ["ground_wailotte","ground_toastie","ground_sugarpop","ground_nibbleaf","ground_cubloaf","diced_wailotte","diced_toastie","diced_sugarpop","diced_nibbleaf","diced_cubloaf"];
let recepies = [["curry","cooked_diced_toastie","diced_cubloaf","cooked_diced_nibbleaf"],["skewers","cooked_diced_toastie","cooked_diced_nibbleaf","cooked_diced_wailotte"],["jiggly burger","diced_cubloaf","cooked_ground_toastie","diced_nibbleaf","ground_sugarpop"],["classic burger","diced_cubloaf","cooked_ground_toastie","diced_nibbleaf","diced_wailotte"],["nibble springs salad","diced_nibbleaf","cooked_ground_sugarpop","diced_wailotte"]]
let current_recepie_index = -1
let current_recepie = []
let dialogue = {bool:true,counter:0} //what dialogue is displayed depends on current recepie


function preload(){
  level = loadImage('Level.png');
  level_overlay = loadImage('Level_overlay.png');
  level_grinder_done = loadImage('Level_grinder_done.png');
  controls = loadImage('controls.png');
  UI = loadImage('UI background.png');
  //items
  bubble = loadImage('bubble.png');
  cubloaf = loadImage('ingredients/cubloaf.png');
  nibbleaf = loadImage('ingredients/nibbleaf.png');
  sugarpop = loadImage('ingredients/sugarpop.png');
  toastie = loadImage('ingredients/toastie.png');
  wailotte = loadImage('ingredients/wailotte.png');
  diced_cubloaf = loadImage('ingredients/cubloaf_chopped.png');
  diced_nibbleaf = loadImage('ingredients/nibbleaf_chopped.png');
  diced_sugarpop = loadImage('ingredients/diced_sugarpop.png');
  diced_toastie = loadImage('ingredients/toastie_chopped.png');
  diced_wailotte = loadImage('ingredients/wailotte_chopped.png');
  ground_cubloaf = loadImage('ingredients/cubloaf_ground.png');
  ground_nibbleaf = loadImage('ingredients/nibbleaf_ground.png');
  ground_sugarpop = loadImage('ingredients/sugarpop_ground.png');
  ground_toastie = loadImage('ingredients/toastie_ground.png');
  ground_wailotte = loadImage('ingredients/wailotte_ground.png');
  cooked_diced_cubloaf = loadImage('ingredients/test_image.png');
  cooked_diced_nibbleaf = loadImage('ingredients/test_image.png');
  cooked_diced_sugarpop = loadImage('ingredients/test_image.png');
  cooked_diced_toastie = loadImage('ingredients/test_image.png');
  cooked_diced_wailotte = loadImage('ingredients/test_image.png');
  cooked_ground_cubloaf = loadImage('ingredients/test_image.png');
  cooked_ground_nibbleaf = loadImage('ingredients/test_image.png');
  cooked_ground_sugarpop = loadImage('ingredients/test_image.png');
  cooked_ground_toastie = loadImage('ingredients/test_image.png');
  cooked_ground_wailotte = loadImage('ingredients/test_image.png');
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
  //dialogue
  dialogue_intro = loadImage('dialogue/dialogue_intro.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();
  frameRate(60);
  strokeWeight(0);
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

function render_item(x,y,w,player){
  //render bubble
  if (player.item != "none"){
    //render bubble
    image(bubble,x-w*1.5,y-w*5,w*3,w*3);
    //render item
    if (player.item == "cubloaf"){
      image(cubloaf,x-w*0.9,y-w*4.4,w*1.7,w*1.7);
    }
    else if (player.item == "nibbleaf"){
      image(nibbleaf,x-w*0.85,y-w*4.5,w*1.8,w*1.8);
    }
    else if (player.item == "sugarpop"){
      image(sugarpop,x-w*0.9,y-w*4.6,w*1.8,w*1.8);
    }
    else if (player.item == "toastie"){
      image(toastie,x-w*0.77,y-w*4.3,w*1.6,w*1.6);
    }
    else if (player.item == "wailotte"){
      image(wailotte,x-w*0.95,y-w*4.95,w*2.3,w*2.3);
    }
    else if (player.item == "diced_cubloaf"){
      image(diced_cubloaf,x-w*0.8,y-w*4.3,w*1.6,w*1.6);
    }
    else if (player.item == "diced_nibbleaf"){
      image(diced_nibbleaf,x-w*0.9,y-w*4.4,w*1.7,w*1.7);
    }
    else if (player.item == "diced_sugarpop"){
      image(diced_sugarpop,x-w*0.8,y-w*4.4,w*1.6,w*1.6);
    }
    else if (player.item == "diced_toastie"){
      image(diced_toastie,x-w*0.9,y-w*4.35,w*1.7,w*1.7);
    }
    else if (player.item == "diced_wailotte"){
      image(diced_wailotte,x-w*0.9,y-w*4.4,w*1.8,w*1.8);
    }
    else if (player.item == "ground_cubloaf"){
      image(ground_cubloaf,x-w*0.8,y-w*4.4,w*1.6,w*1.6);
    }
    else if (player.item == "ground_nibbleaf"){
      image(ground_nibbleaf,x-w*0.9,y-w*4.4,w*1.7,w*1.7);
    }
    else if (player.item == "ground_sugarpop"){
      image(ground_sugarpop,x-w*0.78,y-w*4.3,w*1.5,w*1.5);
    }
    else if (player.item == "ground_toastie"){
      image(ground_toastie,x-w*0.9,y-w*4.4,w*1.7,w*1.7);
    }
    else if (player.item == "ground_wailotte"){
      image(ground_wailotte,x-w*0.9,y-w*4.4,w*1.7,w*1.7);
    }
    else if (player.item == "cooked_diced_cubloaf"){
      image(cooked_diced_cubloaf,x-w*0.8,y-w*4.3,w*1.6,w*1.6);
    }
    else if (player.item == "cooked_diced_nibbleaf"){
      image(cooked_diced_nibbleaf,x-w*0.9,y-w*4.4,w*1.7,w*1.7);
    }
    else if (player.item == "cooked_diced_sugarpop"){
      image(cooked_diced_sugarpop,x-w*0.9,y-w*4.4,w*1.7,w*1.7);
    }
    else if (player.item == "cooked_diced_toastie"){
      image(cooked_diced_toastie,x-w*0.9,y-w*4.4,w*1.7,w*1.7);
    }
    else if (player.item == "cooked_diced_wailotte"){
      image(cooked_diced_wailotte,x-w*0.9,y-w*4.4,w*1.8,w*1.8);
    }
    else if (player.item == "cooked_ground_cubloaf"){
      image(cooked_ground_cubloaf,x-w*0.8,y-w*4.4,w*1.6,w*1.6);
    }
    else if (player.item == "cooked_ground_nibbleaf"){
      image(cooked_ground_nibbleaf,x-w*0.9,y-w*4.4,w*1.7,w*1.7);
    }
    else if (player.item == "cooked_ground_sugarpop"){
      image(cooked_ground_sugarpop,x-w*0.9,y-w*4.4,w*1.7,w*1.7);
    }
    else if (player.item == "cooked_ground_toastie"){
      image(cooked_ground_toastie,x-w*0.9,y-w*4.4,w*1.7,w*1.7);
    }
    else if (player.item == "cooked_ground_wailotte"){
      image(cooked_ground_wailotte,x-w*0.9,y-w*4.4,w*1.7,w*1.7);
    }
  }
}

function render_dialogue(){
  //establish which dialogue to use
  current_dialogue = dialogue_intro

  //render dialogue
  if (dialogue.bool){
    if (windowWidth<windowHeight){ //width is smaller
      image(current_dialogue,0,(windowHeight-windowWidth)-30,windowWidth,windowWidth);
    }
    else{ //height is smaller
      image(current_dialogue,(windowWidth-windowHeight)/2,-30,windowHeight,windowHeight);
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
      if (grinder.state == "done"){
      player.item = grinder.item
      grinder.state = "ready"
      }
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
      if (board1.state == "ready") {
        for (let i = 0; i < grind_or_choppable_list.length; i += 1){ //only allows inputs on this list
          if (player.item == grind_or_choppable_list[i]){
            board1.player = player
            dice(player.item,board1)
            player.item = "none"
            player.freeze = true
          }
        }
      }
    }
    else if (sqrt(sq(abs(x-(362)))+sq(abs(y-(486))))<30/2){
      //chopping board 2
      if (board2.state == "ready") {
        for (let i = 0; i < grind_or_choppable_list.length; i += 1){ //only allows inputs on this list
          if (player.item == grind_or_choppable_list[i]){
            board2.player = player
            dice(player.item,board2)
            player.item = "none"
            player.freeze = true
          }
        }
      }
    }
    else if (sqrt(sq(abs(x-(532)))+sq(abs(y-(427))))<40/2){
      //grinder input
      if (grinder.state == "ready") {
        for (let i = 0; i < grind_or_choppable_list.length; i += 1){ //only allows inputs on this list
          if (player.item == grind_or_choppable_list[i]){
            grind(player.item)
            player.item = "none"
          }
        }
      }
    }
    else if (sqrt(sq(abs(x-(491)))+sq(abs(y-(588))))<30/2){
      //stove1
      if (stove1.state == "ready") {
        for (let i = 0; i < cookable_list.length; i += 1){ //only allows inputs on this list
          if (player.item == cookable_list[i]){
            stove1.player = player
            cook(player.item,stove1)
            player.item = "none"
            player.freeze = true
          }
        }
      }
    }
    else if (sqrt(sq(abs(x-(521)))+sq(abs(y-(586))))<30/2){
      //stove2
      if (stove2.state == "ready") {
        for (let i = 0; i < cookable_list.length; i += 1){ //only allows inputs on this list
          if (player.item == cookable_list[i]){
            stove2.player = player
            cook(player.item,stove2)
            player.item = "none"
            player.freeze = true
          }
        }
      }
    }
  }
  if (sqrt(sq(abs(x-(667)))+sq(abs(y-(552))))<40/2){
    //till
    add_to_till(player.item)
    player.item = "none"
  }
}

function grind(input_item){
  grinder.timer = 0
  grinder.item = input_item
  grinder.state = "processing" //while processing a counter ticks and completed action is checked
}

function dice(input_item,board){
  board.timer = 0
  board.item = input_item
  board.state = "processing"
}

function cook(input_item,stove){
  stove.timer = 0
  stove.item = input_item
  stove.state = "processing"
}

function add_to_till(input_item){
  if (current_recepie_index == -1){
    setup_new_recepie() //start game
  }
  for (let i = 0; i < current_recepie.length;i+=1){
    //print(current_recepie[i]); //uncomment to check recepie
    if (input_item == current_recepie[i]){
      current_recepie.splice(i,1)//startedit, delete count, item to replace
    }
  }
  //check if order is done
  if (current_recepie.length <= 1){
    //note: need to give money and points
    setup_new_recepie()
  }
}

function setup_new_recepie(){
  old_current_recepie_index = current_recepie_index
  while (current_recepie_index == old_current_recepie_index){
    current_recepie_index = Math.floor(random(5)) //from 0 up to specified number but never specified number
  }
  current_recepie = recepies[current_recepie_index] //current_recepie is the finished product followed by its ingredients
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
  if (dialogue.bool){
    dialogue.counter +=1
  }
  if (grinder.state == "processing"){
    grinder.timer += 1
  }
  if (board1.state == "processing"){
    board1.timer += 1
  }
  if (board2.state == "processing"){
    board2.timer += 1
  }
  if (stove1.state == "processing"){
    stove1.timer += 1
  }
  if (stove2.state == "processing"){
    stove2.timer += 1
  }
  //detect finished processes
  if (dialogue.counter > 60*2 && keyIsDown(67) && keyIsDown(190)){
    dialogue.bool = false
    dialogue.counter = 0
  }
  if (grinder.timer>=5*60 && grinder.state == "processing"){
    grinder.state = "done"
    //note: need to visually show grinder as done --------------to do
    grinder.item = "ground_"+grinder.item
  }
  if (board1.timer>=3*60 && board1.state == "processing"){
    board1.state = "ready"
    board1.player.item = "diced_"+board1.item
    board1.player.freeze = false
  }
  if (board2.timer>=3*60 && board2.state == "processing"){
    board2.state = "ready"
    board2.player.item = "diced_"+board2.item
    board2.player.freeze = false
  }
  if (stove1.timer>=4*60 && stove1.state == "processing"){
    stove1.state = "ready"
    stove1.player.item = "cooked_"+stove1.item
    stove1.player.freeze = false
  }
  if (stove2.timer>=4*60 && stove2.state == "processing"){
    stove2.state = "ready"
    stove2.player.item = "cooked_"+stove2.item
    stove2.player.freeze = false
  }


  //get movement inputs
  if (keyIsPressed == true){
    if (player1.freeze == false){
      if (keyIsDown(65)) {player1.dx -= move_speed}; //65 is keycode for a
      if (keyIsDown(68)) {player1.dx += move_speed}; //68 is keycode for d
      if (keyIsDown(87)) {player1.dy -= move_speed}; //87 is keycode for w
      if (keyIsDown(83)) {player1.dy += move_speed}; //83 is keycode for s
    }
    if (player2.freeze == false){
      if (keyIsDown(LEFT_ARROW)) {player2.dx -= move_speed};
      if (keyIsDown(RIGHT_ARROW)) {player2.dx += move_speed};
      if (keyIsDown(UP_ARROW)) {player2.dy -= move_speed};
      if (keyIsDown(DOWN_ARROW)) {player2.dy += move_speed};
    }
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

  //render grinder done
  if (grinder.state == "done"){
    image(level_grinder_done,0,0,windowWidth,windowHeight,camera.x,camera.y,camera.sw,camera.sh,CONTAIN)
  }

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

  //render held item/bubble
  render_item(absolute_to_local_x(player1.x),absolute_to_local_y(player1.y),absolute_to_local_w(15),player1);
  render_item(absolute_to_local_x(player2.x),absolute_to_local_y(player2.y),absolute_to_local_w(15),player2);

  //render dialogue
  render_dialogue();

  //render recepie
  for(let i = 1; i < current_recepie.length; i+=1){
    image(UI,windowWidth-100*i,0, 100,100);
    console.log(current_recepie[i]);
    image(window[current_recepie[i]],windowWidth-100*i,0, 100,100); //note: idk what window[] does but it seems to convert strings to variable names
  } 

  //render controls
  fill(170,175,84);
  rect(0,windowHeight-32,windowWidth,32);
  image(controls,0,windowHeight-32,controls.width,controls.height);

  /*
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
  */
  //tracking
  fill(0)
  text(player1.item,20,20);
  text(player2.item,20,40);
  text(current_recepie_index,20,60);
}
