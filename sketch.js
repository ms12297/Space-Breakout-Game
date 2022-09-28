let back1;
let back2;
let backW = 500;
let backL = 1000;
let back1y = 0;
let back2y = -1000;
let ship;
let hit;
let bounce;
let over;
let rectX = 200;
let rectY = 480;
let rectW = 100;
let rectL = 20;
let cenX = 250;
let cenY = 250;
let ballW = 20;
let xSpeed = 0;
let ySpeed = 0;
let trigger = 0;
let start = 0;
let border = 25;
let ufoX;
let ufoY;
let ufoD = 90;
let bounces = 0;
let hits = 0;
let hue = 0;


function preload(){
  soundFormats('wav', 'mp3');
  hit = loadSound("ship_caught");
  bounce = loadSound("space_bounce");
  over = loadSound("game_over");
  ufo = loadImage("ufo.png");
  back1 = loadImage("starfield.png");
  back2 = loadImage("starfield.png");
}

function setup() {  
  createCanvas(500, 500);
}

function draw() {
  
  //background
  image(back1, 0, back1y, backW, backL);
  image(back2, 0, back2y, backW, backL);
  
  back1y += 2;
  back2y += 2;
  
  if (back1y > 1000) {
    back1y = back2y - 1000;
  }
  if (back2y > 1000) {
    back2y = back1y - 1000;
  }
  
  //edges
  fill(120);
  rect(0, 0, width, border);
  rect(0, 0, border, height);
  rect(width - border, 0, border, height);
  fill(120);
  noStroke();
  
  //scores
  fill(255);
  text("Bounces: " + bounces + " UFOs: " + hits, border, border * 0.7);
  
  //paddle
  fill(255);
  rect(rectX, rectY, rectW, rectL);
  
  if (keyIsDown(65) && rectX > border+3) {
    rectX -= 2;
  }
  
  if (keyIsDown(68) && rectX < width - (rectW + border + 3)) {
    rectX += 2;
  }
  
  //ball
  colorMode(HSB);
  fill(hue, 255, 100);
  hue += 0.5;
  if (hue > 255) {
    hue = 0;
  }
  
  ellipse(cenX, cenY, ballW, ballW);
  
  colorMode(RGB);
  
  if (trigger == 1 && start == 0) {
    xSpeed = rand();
    ySpeed = rand();
    
    //initializing ufo
    ufoPos();
    
    //starting game
    trigger = 0;
    start = 1;
    hits = 0;
    bounces = 0;
  }
  
  cenX += xSpeed;
  cenY += ySpeed;
  
  //checking collisions with borders
  if (cenX > width - border - 10 || cenX < border + 10) {
    xSpeed *= -1;
    bounces += 1;
    bounce.play();
  }
  if (cenY < border + 10) {
    ySpeed *= -1;
    bounces += 1;
    bounce.play();
  }
  if (cenY > height + 10) {
    over.play();
    xSpeed = 0;
    ySpeed = 0;
    cenX = width/2;
    cenY = height/2;
    start = 0;
  }
  
  //collision with paddle
  if (cenX > rectX && cenX < rectX + rectW && cenY > rectY - 10) {
    ySpeed *= -1;
    cenY = rectY - 10;
    bounces += 1;
    bounce.play();
    xSpeedSet();
  }

  //ufo 
  if (start == 1) {
    image(ufo, ufoX, ufoY, ufoD, ufoD);
    //checking collisions using the circle equation for the ufo
    let cenUfoX = ufoX + ufoD/2;
    let cenUfoY = ufoY + ufoD/2;
    let ufoEq = pow((cenX - cenUfoX), 2) + pow((cenY - cenUfoY), 2);
    if (ufoEq < pow(ufoD/2 + 5,2)) { //+5 to increase radius of UFO to make collisions look more realistic visually
      ufoPos();
      hits += 1;
      hit.play();
    }
  }
}

function mousePressed() {
  trigger = 1;
}

function rand() {
  let val = random(-3,3);
    if (val < 1 && val > 0) {
      val = random(1,3);
    }
     if (val > -1 && val < 0) {
      val = random(-3,-1);
    }
  return val;
}

function ufoPos() {
  ufoX = random(border + ufoD, 500 - border - ufoD);
  ufoY = random(border + ufoD, 300 - ufoD);
}

function xSpeedSet() {
  let currX = cenX;
  let x;
  if (cenX < rectX + rectW/2 && cenX > rectX) {
    if (xSpeed > 0) {
      x = map(currX, rectX, rectW/2 + rectX, 4, 1);
    }
    else {
      x = map(currX, rectX, rectW/2 + rectX, -4, -1);
    }
  }
  if (cenX < rectX + rectW && cenX > rectX + rectW/2) {
    if (xSpeed > 0) {
      x = map(currX, rectX + rectW/2, rectW + rectX, 1, 4);
    }
    else {
      x = map(currX, rectX + rectW/2, rectW + rectX, -1, -4);
    }
  }
  xSpeed = x;
}