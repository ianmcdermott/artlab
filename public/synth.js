let osc;
let playing = true; 
let env;

let attackLevel = 1.0;
let releaseLevel = 0;

// let attackTime = 0.9
// let decayTime = 0.002;
// let susPercent = 2;
// let releaseTime = 0.005;

let adsrKnob = [4];
let playhead;
let adsrScreen;
let waveTypeMod;
let knob;
let midiBar;
let waveTypeButton = [4];

function setup(){
	createCanvas(800,800);
	osc = new p5.Oscillator();

	button = createButton('play/pause');
	button.mousePressed(toggle);
	env = new p5.Env();
	// env.setADSR(attackTime, decayTime, susPercent, releaseTime);
	// env.setRange(attackLevel, releaseLevel);
	osc.setType("sine");
	osc.start();
	osc.amp(env);
	osc.freq(432);
  waveTypeMod = new WaveTypeModule(0, height*3/4, width, height/4);
  playhead = new PlayHead(0, 5);
	// knob = new Knob(width/8, height/2, width/8, 150, 0, "hello");
  adsrMod = new AdsrModule(0, height/2, width, height/4, 0);
  midiBar = new MIDIBar(0, height/4, width/2, height/4)
	// Create each ADSR knob
}

function draw(){
	background(255);
  for(let i = 0 ; i< 4; i++){
    strokeWeight(2);
    noFill();
    stroke(200);
    line(i*width/4+width/8, 0, i*width/4+width/8, height);
    stroke(127);
    rect(i*width/4, 0, width/4, height);
  }
  noStroke();
	playhead.update();
  midiBar.display();
  playhead.display();
  adsrMod.display();
  waveTypeMod.display();
}

function updateOsc(){
    // osc.setType(WaveTypeModule.returnValue());

}

// Playhead Class
class PlayHead{
  constructor(_x, _w){
    this.x = _x;
    this.w = _w;
  }

  update(){
    this.x+=4;
    if(this.x >= width+this.w){
      this.x = 0;
    }
  }

  display(){
    fill(0);
    rect(this.x, 0, this.w, height);
  }

}

// Note Length Class
class MIDIBar{
  constructor(_x, _y, _w, _h){
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.mouseIsOn = false;
  }

  mouseOn(mx, my){
    let d = abs(mx - this.w);
    if(d < 20){
      this.mouseIsOn = true;
    }
  }

  midiBarDragged(mx, my){
    let d = abs(mx - this.w);

    if(d < 20 && this.mouseIsOn){
      this.w = mx;
    }
  }

  midiBarReleased(){
    this.mouseIsOn = false;
  }

  display(){
    rectMode(CORNER);
    fill("#FFCE2E");
    noStroke();
    rect(this.x, this.y, this.w, this.h)
  } 
}

function updateADSR(){
	let /*this.*/attackTime = adsrKnob[0].value;
	let /*this.*/decayTime = adsrKnob[1].value;
	let /*this.*/susPercent = adsrKnob[2].value;
	let /*this.*/releaseTime = adsrKnob[3].value;

	env.setADSR(attackTime, decayTime, susPercent, releaseTime);
	env.setRange(attackLevel, releaseLevel);
}

function mouseDragged(){
	adsrMod.adsrMouseDragged(mouseX, mouseY);
  midiBar.midiBarDragged(mouseX, mouseY);

}

function mousePressed(){
  adsrMod.adsrMousePressed(mouseX, mouseY);
  midiBar.mouseOn(mouseX, mouseY);
}


function mouseReleased(){
  adsrMod.adsrMouseReleased();
  midiBar.midiBarReleased();
}

function toggle(){
	 env.play();
}

class Synth{

}

class WaveTypeModule{
  constructor(_x, _y, _w, _h){
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.waveType = ['sine', 'square', 'triangle', 'sawtooth']

    for(let i = 0; i < 4; i++){
       waveTypeButton[i] = new WaveTypeButton((this.w/8+i*this.w/4), this.y+this.h/2, this.w/8, this.h/3, i, this.waveType[i]);
    }
  }



  display(){
    fill("#FFCE2E");
    noStroke();
    rect(this.x, this.y, this.w, this.h);
    for(let i = 0; i < this.waveType.length; i++){
      waveTypeButton[i].display();
    }
  }
} 

class WaveTypeButton{
    constructor(_x, _y, _w, _h, _index, _name){
      this.x = _x;
      this.y = _y;
      this.w = _w;
      this.h = _h;
      this.mouseIsOn = false;
      this.index = _index;
      this.name = _name;
      // this.color = random(255,255,255);
  }

  display(){
    rectMode(CENTER);
    noStroke();
    if(this.index % 2 == 0) fill(255);
    else fill(0);
    rect(this.x, this.y, this.w, this.h);
  }
}

class AdsrModule{
  constructor(_x, _y, _w, _h, _c){
    this.w = _w;
    this.h = _h;
    this.x = _x;
    this.y = _y;
    this.color = _c;
    
    let ADSR = ["attack", "decay", "sustain", "release"]
    //update this.w to midibar.w for adsrScreen
    adsrScreen = new AdsrScreen(this.x, 0, this.w, this.h, 5);

    for(let i = 0; i < 4; i++){
      adsrKnob[i] = new Knob((this.w/8+i*this.w/4), this.y+this.h/2, this.w/8, 150, .5-i*.1, i, ADSR[i]);
    }
  }

  adsrMousePressed(mx, my){
    for(let i = 0; i < adsrKnob.length; i++){
      adsrKnob[i].mouseOn(mx, my);  
    }
  }

  adsrMouseReleased(mx, my){
    for(let i = 0;i < adsrKnob.length; i++){  
      adsrKnob[i].mouseOff();
    }
  }

  adsrMouseDragged(mx, my){
    for(let i = 0;i < adsrKnob.length; i++){
      adsrKnob[i].turned(mx, my);
    }
  }

  display(){
    // translate(this.x, this.y);
    fill(this.color);
    rect(0, this.y, this.w, this.h);
    for(let i = 0;i < adsrKnob.length; i++){
      adsrKnob[i].display();
    }
    updateADSR();
    adsrScreen.display();
  }
}

class AdsrScreen{
  constructor(_x, _y, _w, _h, _thickness){
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.thickness = _thickness;
  }

  display(){
    strokeWeight(this.thickness);
    noFill();
    stroke(255, 0, 0)
    let attackHeight = map(adsrKnob[0].value, 0, 1, 0, this.h);
    let decayHeight = map(adsrKnob[1].value, 0, 1, 0, this.h);
    let susHeight = map(adsrKnob[2].value, 0, 1, 0, this.h);
    let releaseHeight = map(adsrKnob[3].value, 0, 1, 0, this.h);


    line(0, this.h, midiBar.w/4, this.h-attackHeight);
    line(midiBar.w/4, this.h-attackHeight, midiBar.w/2, this.h-decayHeight);
    line(midiBar.w/2, this.h-decayHeight, midiBar.w*3/4, this.h-decayHeight);
    line(midiBar.w*3/4, this.h-decayHeight, midiBar.w, this.h);
    noStroke();
  }
}

//class for synth knob
class Knob{
	constructor(_x, _y, _r, _theta, _v, _index, _name){
		this.x = _x;
		this.y = _y;
		this.r = _r;
		this.theta = _theta;
		this.value = _v;
		this.mouseIsOn = false;
		this.index = _index;
		this.name = _name;
		// this.color = random(255,255,255);
	}

	mouseOn(mx, my){
		let d = dist(mx, my, this.x, this.y);
		if(d < this.r/2){
			this.mouseIsOn = true;
		}
	}

	mouseOff(){
		this.mouseIsOn = false;
	}

	turned(mx, my){
		//map the mouse dragging to be between values of knob
		let d = dist(mx, my, this.x, this.y)
		if(d < this.r && this.mouseIsOn){
			this.value = map(constrain(mx, (this.x-this.r), (this.x+this.r)), (this.x-this.r), (this.x+this.r), 0, 1);
			this.theta = map(constrain(mx, (this.x-this.r), (this.x+this.r)), (this.x-this.r), (this.x+this.r), 0, 300);
		} else {
			this.mouseIsOn = false;
		}
	}

	display(){
		noStroke();
		//x location based off of knob's index
		push();

		translate(this.x, this.y)
		rotate(radians(this.theta)-100);

		if(this.index % 2 == 1)  fill(255);
		else fill("#FFCE2E");
		ellipse(0, 0, this.r);
		
		push();
		if(this.index % 2 == 1) fill("#FFCE2E");
		else fill(0);
		ellipse(0, this.r/3, this.r/4);

		pop();
		pop();

    push();
    translate(this.x, this.y)

    fill(255);
    textSize(30);
    textAlign(CENTER);
    text(this.name, 0, 80)
    pop();
	}
}