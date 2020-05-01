var b,maxMove,drag,strength,velx, vely,cantBalls,setBalls, ableToModify;
var loaded = false;
var backgroundS, hardS, leadS, currentBeat;
var loadedFont;

function preload() {
  backgroundS = new Tone.Player("background.wav").toMaster();
  hardS = new Tone.Player("hardSynth.wav").toMaster();
  leadS = new Tone.Player("lead.wav").toMaster();

  loadedFont = loadFont("SpaceMono-Regular.ttf");

}


function setup() {
  createCanvas(windowWidth, windowHeight);
  cantBalls = windowWidth;
  //b = new ball(200,200);
  setBalls = [];
  for (let i = 0; i < cantBalls/2; i++){
    b = new ball(random(windowWidth),random(windowHeight),255);
    bv = new ball(random(windowWidth),random(windowHeight),50);
    b3 = new ball(random(windowWidth),random(windowHeight),150);
    setBalls.push(bv);
    setBalls.push(b3);
    setBalls.push(b);


    ableToModify = true;
    //

    loopBeat = new Tone.Loop(song, "4n");
    Tone.Transport.bpm.value = 60;
  }
  
  maxMove = 1;
  drag = 0.75; 
  strength = 0.1; 
  velx = vely = 0;
  noStroke();
}

var textsize = 20;
var textAlfa = 255;

function draw() {
  

  background(0);
  for (let i = 0; i < cantBalls; i++){
    setBalls[i].move(setBalls[i].getx() + random(-maxMove,maxMove) * (setBalls[i].getColor()+1)/255  , setBalls[i].gety() + random(-maxMove,maxMove) * (setBalls[i].getColor()+1)/255);
    setBalls[i].draw();
  }
  strength = map(mouseX,0,windowWidth,0.1,0.5);
  drag = map(mouseY,0,windowHeight, 0.7,0.05);

  if (ableToModify){
    leadS.volume.value = map(mouseX, 0, windowWidth * 0.8, -14, 0, true);
    hardS.volume.value = map(mouseY, 0, windowHeight * 0.8, 0, -14, true);
  }
  if (!loaded) {
    loaded =
      backgroundS.loaded &&
      hardS.loaded &&
      leadS.loaded
    background(0);
  }
  else{
    if (textAlfa > 0){
      textFont(loadedFont);
      textSize(textsize);

      background(0,textAlfa);
      fill(255, textAlfa);
      textAlfa --;
      textAlign(CENTER);
      text("Click the mouse to play the music", windowWidth / 2, windowHeight / 2);
    }
  }
}

class ball{
  constructor(x,y,colorr){
    this.x = x;
    this.y = y;
    this.color = colorr;
  }
  draw(){
    fill(this.color);
    circle (this.x,this.y, 2)
  }
  move(x,y){
    let fx = -this.x + x;
    let fy = -this.y + y;
    fx *= strength;
    fy *= strength;
    
    velx *= drag;
    velx += fx;
    vely *= drag;
    vely += fy;
    
    
    this.x += velx;
    this.y += vely;
  }

  getx(){return this.x}
  gety(){return this.y}
  getColor(){return this.color}

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cantBalls = windowWidth;
  setBalls = [];
  for (let i = 0; i < cantBalls/2; i++){
    b = new ball(random(windowWidth),random(windowHeight),255);
    bv = new ball(random(windowWidth),random(windowHeight),50);
    b3 = new ball(random(windowWidth),random(windowHeight),150);
    setBalls.push(bv);
    setBalls.push(b3);
    setBalls.push(b);
  }
}

function song(time) {
  currentBeat = split(Tone.Transport.position, ":");
  console.log(currentBeat);

  if (currentBeat[0] % 8 == 0 && currentBeat[1] == 0) {
    //ableToModify = false;
    backgroundS.start();
    hardS.start();
    leadS.start();

    beginTransition();
  }
  else{
    ableToModify = true;
  }
}

function mousePressed() {
  playf();
  return false;
}

function playf() {
  if (loaded) {
    Tone.Transport.start();
    loopBeat.start(0);    
  }
}

function beginTransition(){

}