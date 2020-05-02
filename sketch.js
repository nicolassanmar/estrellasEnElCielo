var b,maxMove,drag,strength,velx, vely,cantBalls,setBalls, ableToModify, started;
var loaded = false;
var backgroundS, hardS, leadS, currentBeat, autoFilter;
var loadedFont;

var maxVolume = -20;

function preload() {
  autoFilter = new Tone.AutoFilter("4n").toMaster().start();
  autoFilter.wet.value = 0.2;
  backgroundS = new Tone.Player("background.ogg").connect(autoFilter);
  hardS = new Tone.Player("hardSynth.ogg").toMaster();
  leadS = new Tone.Player("lead.ogg").toMaster();

  loadedFont = loadFont("SpaceMono-Regular.ttf");

}


function setup() {


  createCanvas(windowWidth, windowHeight);
  cantBalls = windowWidth;
  //b = new ball(200,200);
  setBalls = [];
  stillStars = [];
  for (let i = 0; i < cantBalls/2; i++){
    b = new ball(random(windowWidth),random(windowHeight),255);
    setBalls.push(b);

  }
  for (let i = 0; i < cantBalls/2; i++){
    let b3 = new ball(random(windowWidth),random(windowHeight),150);
    setBalls.push(b3);

  }  for (let i = 0; i < cantBalls/2; i++){
    let bv = new ball(random(windowWidth),random(windowHeight),100);
    setBalls.push(bv);
  }


  for (let i = 0; i < cantBalls/2; i++){
    let still = new ball(random(windowWidth),random(windowHeight),70);
    stillStars.push(still);
  }
    ableToModify = true;
    //

    loopBeat = new Tone.Loop(song, "4n");
    Tone.Transport.bpm.value = 60;
 
  
  maxMove = 1;
  drag = 0.75; 
  strength = 0.1; 
  velx = vely = 0;
  noStroke();

  started = false;
}

var textsize = 20;
var textAlfa = 255;

function draw() {

  background(0);
  for (let i = 0; i < (cantBalls/2) * 3; i++){
    setBalls[i].move(setBalls[i].getx() + random(-maxMove,maxMove) * (setBalls[i].getColor()+1)/255  , setBalls[i].gety() + random(-maxMove,maxMove) * (setBalls[i].getColor()+1)/255);
    setBalls[i].draw();
  }
  for (let i = 0; i < cantBalls/2; i++){
    stillStars[i].move(stillStars[i].getx() + random(-maxMove,maxMove) * (stillStars[i].getColor()+10)/255  , stillStars[i].gety() + random(-maxMove,maxMove) * (stillStars[i].getColor()+1)/255);
    stillStars[i].draw();
  }
  strength = map(mouseX,0,windowWidth,0.1,0.5);
  drag = map(mouseY,0,windowHeight, 0.7,0.05);


  if (started && maxVolume < -3){
    console.log(maxVolume);
    maxVolume += 0.2;
    backgroundS.volume.value = maxVolume;
  }
  if (ableToModify){
    leadS.volume.value = map(mouseX, 0, windowWidth * 0.8, -16, maxVolume, true);
    hardS.volume.value = map(mouseY, 0, windowHeight * 0.8, maxVolume, -16, true);
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
      fill(255, int(textAlfa) );
      textAlfa -= 0.7;
      textAlign(CENTER);
      text("Click the mouse to play the music\nPress \"r\" to attract the stars", windowWidth / 2, windowHeight / 2);
    }
  }

  centrarEstrellas();
  dispersarse();
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cantBalls = windowWidth;
  setBalls = [];
  for (let i = 0; i < cantBalls/2; i++){
    b = new ball(random(windowWidth),random(windowHeight),255);
    let bv = new ball(random(windowWidth),random(windowHeight),100);
    let b3 = new ball(random(windowWidth),random(windowHeight),150);
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
    backgroundS.volume.value = maxVolume;
    hardS.volume.value = maxVolume;
    leadS.volume.value = maxVolume;

    backgroundS.start();
    hardS.start();
    leadS.start();

    beginTransition();
    if (currentBeat[0] == 0){
      started = true;
    }
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



var centrar = false;
var irse ;
var randomPositions = [];

function keyPressed(){
  if (keyCode == 82){ //r
    centrar = !centrar;
    console.log("r");

    autoFilter.wet.linearRampTo(0.8,1);

    if (!centrar){
      irse = 40;
      autoFilter.wet.linearRampTo(0.2,1);

      llenarPosiciones();
    }
  }
  return false;
}

function llenarPosiciones(){
  randomPositions = [];
  for (let i = 0; i < (cantBalls/2) *2; i++){
    let aux = new position(random(windowWidth),random(windowHeight));
    randomPositions.push(aux);
  }
}

function centrarEstrellas(){
  if (centrar){
    let auxStr = strength;
    strength = 0.01;
    for (let i = 0; i < (cantBalls/2) *2; i++){
      let distancia = dist(setBalls[i].getx(), setBalls[i].gety(), mouseX,mouseY);
      if ( (distancia > (windowWidth* 0.25)) && (distancia < (windowWidth* 0.3))  ){
        setBalls[i].move(lerp(mouseX,setBalls[i].getx(),0.95)
        ,lerp(mouseY,setBalls[i].gety(),0.95));
    
      }
      else if (distancia < windowWidth* 0.08 ){
        let masOmenos = ((i%2) == 0) ;
        let mult = -1;
        if (masOmenos){mult = 1}
        setBalls[i].move(setBalls[i].getx()+random(50,150)*mult, setBalls[i].gety()+random(50,150)*mult );
      }
      else{
        setBalls[i].move(lerp(random(setBalls[i].getx() -windowWidth,setBalls[i].getx()+ windowWidth),setBalls[i].getx(),0.96)
        ,lerp(random(setBalls[i].gety() -windowHeight,setBalls[i].gety()+ windowHeight)     ,setBalls[i].gety(),0.96));
      }
    }
      strength = auxStr;
  }
}
function dispersarse(){
  if (irse > 0){
    for (let i = 0; i < (cantBalls/2) *2; i++){
      setBalls[i].move(lerp(randomPositions[i].x,setBalls[i].getx(),0.2)
        ,lerp(randomPositions[i].y,setBalls[i].gety(),0.2));
    }
    irse--;
  }
}

