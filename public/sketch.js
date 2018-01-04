
let x = 0;
let creamsicle = '#ffb241';
let sage = '#39b876';
let magenta = '#e32c7e';
let eraser = '#a7edff';
let colorArray = [sage, creamsicle, magenta, eraser];
let defaultSwatch = colorArray[0];

let radius = 50;
let fillColor = sage;
let strokeColor = 255;
let strokeOn = false;
let fillOn = true;
let numColor = 4;
let swatches = [];
let brush;

let frameThickness = $("#js-sketch-holder").width()/10;
let canvasWidth = $("#js-sketch-holder").width();
let initialRadius = canvasWidth/20;
let colorSwatchRadius = canvasWidth/10;
let maxWidth = 1110;

let responsiveRatio = maxWidth/canvasWidth;

let strokeI;
let img;
// let pg;

let isDrawing = false;
let releasedMouse = false;

let guideList = [];
let fc =0;
let displayOn = true; 

function preload(){
	let frameNum = stringifyFrameNumber(userArtworkObject.frameCount);
	// Load guide image
	img = loadImage(GUIDE_URL+frameNum+EXTENSION);
}

function windowResized() {
  	resizeCanvas($("#js-sketch-holder").width(),$("#js-sketch-holder").width());
	canvasWidth = $("#js-sketch-holder").width();
	frameThickness = canvasWidth/10;
	initialRadius = canvasWidth/20;
	colorSwatchRadius = canvasWidth/10;
	let responsiveRatio = maxWidth/canvasWidth;

	for(let i = 0; i < numColor; i++){
		swatches[i].resize(((i*colorSwatchRadius)+colorSwatchRadius/2), 
												  colorSwatchRadius/2, 
												  colorSwatchRadius/2)
	}
	fillIcon.resize(canvasWidth-frameThickness*.75, canvasWidth/40, canvasWidth/20);
}

function setup() {
	let canvas  = createCanvas(canvasWidth, canvasWidth);
	canvas.parent('js-sketch-holder');
	noStroke();
	// fill(255);
	// rect(100, 100, 1000, 1000);
	brush = new Brush(initialRadius, defaultSwatch);
		console.log(guideList.length);

	let submitButton = select('#js-artwork-submit');
	let clearButton  = select('#js-artwork-clear');
	clearButton.mousePressed(clearDrawing);
	//populate color swatches
	createPallet();
	smooth();

}

function draw() {
	background(eraser);
	initialRadius = canvasWidth/20;

	responsiveRatio = maxWidth/canvasWidth;
	('image is '+ guideList[0]);
	//set guide image within the frame
	image(img, frameThickness, frameThickness, canvasWidth*.8,  canvasWidth*.8);
	//set frame
	displayDrawing();
	frame();	
	renderPallet();

	brush.display(mouseX, mouseY);
	fc++;
	if(fc > guideList.length-1) fc = 0;

	if(keyIsPressed){
	}
}


function stringifyFrameNumber(n){
	return (('0000'+n).slice(-5));
}


function displayDrawing(){
	if(drawing){
		for (let i = 0; i < drawing.length; i++) {
	   		let lines = drawing[i].lines;
	   		let points = drawing[i].points;
			let weight = drawing[i].radius/responsiveRatio;

			if(lines){
				for(let j = 0; j < lines.length; j++){
					let c = drawing[i].color;
					strokeWeight(weight);
					stroke(c);
					line(lines[j].mouseX/responsiveRatio, lines[j].mouseY/responsiveRatio, lines[j].pmouseX/responsiveRatio, lines[j].pmouseY/responsiveRatio);
				}
			}
			if(points){
				for(let j = 0; j < points.length; j++){
					let c = drawing[i].color;
					noStroke();
					fill(c);
					ellipse(points[j].x/responsiveRatio, points[j].y/responsiveRatio, weight, weight);
				}
			}
		}
	}
}

function createPallet(){
	for(let i = 0; i < numColor; i++){
		swatches.push(new ColorSwatch(	((i*colorSwatchRadius)+colorSwatchRadius/2), 
																colorSwatchRadius/2, 
																colorSwatchRadius/2, 
																    colorArray[i]));
	}

	//strokeIcon = new Str5okeIcon(1125, 30, 40);
	fillIcon = new FillIcon(canvasWidth-frameThickness*.75, canvasWidth/40, canvasWidth/20);
}

function renderPallet(){
	for(let i = 0; i < numColor; i++){
		swatches[i].display();
	}
	//strokeIcon.display();
	fillIcon.display();
}

function frame(){
	//FRAME DEBUG
		// noFill();
		// stroke(0)
		// strokeWeight(1);
	
	//Frame Appearance
	noStroke();
	fill(0);
	
	//Frame Render
	rect(0, 0, canvasWidth, frameThickness);
	rect(0, canvasWidth-frameThickness, canvasWidth, frameThickness);
	rect(0, 0, frameThickness, canvasWidth);
	rect(canvasWidth-frameThickness, 0, frameThickness, canvasWidth);
}

function mouseDragged() {
	if(mouseX > frameThickness && mouseX < canvasWidth-frameThickness && mouseY > frameThickness && mouseY <  canvasWidth-frameThickness){
		isDrawing = true;
		releasedMouse = false;
		brush.drag(mouseX, mouseY);
		displayOn = false;
		return false;
	}
}

function mouseReleased(){
	releasedMouse = true;
	displayOn = true;

	isDrawing = false;
}

function mouseClicked(){
	isDrawing = true;
	for(let i = 0; i < numColor; i++){
		swatches[i].clicked(mouseX, mouseY);
	}
	if(mouseX >= frameThickness && mouseX <= canvasWidth-frameThickness && mouseY >= frameThickness && mouseY <= canvasWidth-frameThickness) {
		brush.click(mouseX, mouseY);
	}
}

function keyPressed(){
	if(key === 'Ý'){
		if(keyIsDown(SHIFT)){
			brush.sizeUp(10);
		} else {
			brush.sizeUp(1);
		}
	}
	if(key === 'Û'){
		if(keyIsDown(SHIFT)){
			brush.sizeDown(10);
		} else {
			brush.sizeDown(1);
		}
	}
	if(key === 'e' || key === 'E'){
	}

	if(key === 'b' || key === 'B'){
	}

}

function ColorSwatch(_x, _y, _r, _c){
	this.x = _x;
	this.y = _y;
	this.r = _r;
	this.c = _c;

	this.display = function(){
		fill(this.c);
		ellipse(this.x, this.y, this.r, this.r);
	}

	this.clicked = function(_x, _y){
		let d = dist(_x, _y, this.x, this.y);
		//if mouse is inside swatch, update brush and fill icon
			if(d < this.r){
				fillIcon.c = this.c;
			//	brush.updateColor(this.c);
		}
	}

	this.resize = function(_x, _y, _r){
		this.x = _x;
		this.y = _y;
		this.r = _r;
	}
}

class Icon{
	constructor(_x, _y, _r){
		this.x = _x;
		this.y = _y;
		this.r = _r;
		this.c = defaultSwatch;
	}

	display(){
		rect(this.x, this.y, this.r);
	}

	resize(_x, _y, _r){
		this.x = _x;
		this.y = _y;
		this.r = _r;
	}
}


class StrokeIcon extends Icon{
	display(){
		stroke(this.c);
		strokeWeight(10);
		noFill();
		rect(this.x, this.y, this.r, this.r);
	}
}

class FillIcon extends Icon{
	display(){
		fill(this.c);	
		noStroke();
		rect(this.x, this.y, this.r, this.r);
	}
}

class Brush{
 	constructor( _r, _c){
 		this.r = _r;
 		this.c = _c;
  		this.path = {
			points: [],
			lines: [],
			color: this.c,
			radius: this.r
		};
		this.dragging = false;

 	}

	display(_x, _y){
		if(displayOn){
			stroke(0, 40);
			noFill();
			strokeWeight(1);
			noSmooth();
			ellipse(_x, _y, this.r);
			smooth();
		}
	}

	drag(_x, _y){
		this.x = _x;
		this.y = _y;

		this.path = {
			points: [],
			lines: [],
			color: this.path.color,
			radius: this.radius
		};

		if(isDrawing){
			let weight = this.r+constrain(dist(mouseX, mouseY, pmouseX, pmouseY), 0, 25);
			let mx = this.x*responsiveRatio;
			let my = this.y*responsiveRatio;
			let pmx = pmouseX*responsiveRatio;
			let pmy = pmouseY*responsiveRatio;
			let lineCoords = {mouseX: mx, mouseY: my, pmouseX: pmx, pmouseY: pmy};
			this.path.lines.push(lineCoords);
			this.path.radius = weight*responsiveRatio;
			this.path.color = fillIcon.c;

			if(releasedMouse){
				releasedMouse = false;
			}
		}
		drawing.push(this.path);
	}

	click(_x, _y){
		this.x = _x;
		this.y = _y;

		this.path = {
			points: [],
			lines: [],
			color: this.path.color,
			radius: this.r
		};
		//if(isDrawing){
			this.path.points.push({x: (this.x*responsiveRatio), y: (this.y*responsiveRatio)});
			this.path.color = fillIcon.c;
			this.path.radius = this.r*responsiveRatio;

			drawing.push(this.path);
			//releasedMouse = false;
	//	}
	}

	sizeUp(amount){
		this.r += amount;
	}


	sizeDown(amount){
		this.r -= amount;
	}

}


function clearDrawing() {
  drawing = [];
}

// class Eraser extends Brush{
// 	constructor(_r, _c){
// 		super(this.r) = _r;
// 		super(this.c) = fill(255);
// 	}
// }

