let handleRad = 5;
let handleGrabbed1 = false;
let handleGrabbed2 = false;
let handleIndex;
let penOn = true; 
let penActive = false;
let addingControlOne = false;
let shape = {
	ax: 85,
	ay: 20,
	b1: [
		{
			cx1: 10,
			cy1: 10,
			cx2: 90,
			cy2: 90,
			ax: 15,
			ay: 80
		},
		{
			cx1: 210,
			cy1: 110,
			cx2: 290,
			cy2: 290,
			ax: 215,
			ay: 280
		},
		{
			cx1: 410,
			cy1: 410
		}
		]
}

function setup(){
	createCanvas(800, 800);
}

function draw(){
	background(255);
	drawShape(shape);
}

function mousePressed(){
	//loop through array of shape's control points
	for(let i = 0; i < shape.b1.length; i++){
		let d1 = dist(mouseX, mouseY, shape.b1[i].cx1, shape.b1[i].cy1)
		let d2 = dist(mouseX, mouseY, shape.b1[i].cx2, shape.b1[i].cy2);
		if(d1 < handleRad/2+2){
			penActive = false;
			handleGrabbed1 = true;
			handleGrabbed2 = false;
			handleIndex = i;
			break;
		} else if(d2 < handleRad/2+2){
			penActive = false;
			handleGrabbed2 = true;
			handleGrabbed1 = false;
			handleIndex = i;
			break;
		}
	}
		if(penOn && !handleGrabbed2 && !handleGrabbed1){
			penActive = true;
			addingControlOne = true;
			shape.b1[shape.b1.length-1].ax = mouseX;				
			shape.b1[shape.b1.length-1].ay = mouseY;	
			// drawShape(shape);
		}
	}


function mouseReleased(){
		penActive = false;
		handleGrabbed1 = false;
		handleGrabbed2 = false;
		addingControlOne = false;
		shape.b1[shape.b1.length-1].complete = true;
}

function handle(cx, cy, ax, ay, f){
	//Cancel out stroke for ellipse handle
	noStroke();
	fill(f);
	ellipse(cx, cy, 5, 5);
	//Cancel out fill for line
	noFill();
	stroke(0, 255, 0);
	line(ax, ay, cx, cy);
}

function mouseDragged(){
	if(handleGrabbed2){
		// handleGrabbed1 = true;
		shape.b1[handleIndex].cx2 = mouseX;
		shape.b1[handleIndex].cy2 = mouseY;
	} else if(handleGrabbed1){
		// handleGrabbed2 = true;
		shape.b1[handleIndex].cx1 = mouseX;
		shape.b1[handleIndex].cy1 = mouseY;
	} else if(penActive){
		if(!shape.b1[shape.b1.length-1].complete){
			shape.b1[shape.b1.length-1].cx2= mouseX;
			shape.b1[shape.b1.length-1].cy2= mouseY;
		}
		//if pen is active, extend the shape with anchor and c2 points
		if(addingControlOne){
			shape.b1.push({
				
			})
			addingControlOne = false;
		}
		let currentAX = shape.b1[shape.b1.length-2].ax;
		let currentAY = shape.b1[shape.b1.length-2].ay;
		let mV = createVector(mouseX, mouseY);
		let aV = createVector(currentAX, currentAY);

		let controlMag = p5.Vector.sub(mV, aV);
		let cax = aV.x-controlMag.x;
		let cay = aV.y-controlMag.y;
		// shape.b1.push
		shape.b1[shape.b1.length-2].cx1 = cax;
		shape.b1[shape.b1.length-2].cy1 = cay;
	}
}

function drawShape(s){
	beginShape();
	vertex(s.ax, s.ay);
	for(let i = 0; i < s.b1.length-1; i++){

	stroke(0, 0, 0);
		if(s.b1[i].ax){
			if(s.b1[i].cy2){
				bezierVertex(s.b1[i].cx1, s.b1[i].cy1, s.b1[i].cx2, s.b1[i].cy2, s.b1[i].ax, s.b1[i].ay);
			} 
		}
	}

	endShape();
	for(let i = s.b1.length-2; i < s.b1.length; i++){
		if(s.b1[4]) console.log("hehe"+s.b1[4].cx2);
		handle(s.b1[i].cx2, s.b1[i].cy2, s.b1[i-1].ax, s.b1[i-1].ay, "#ff0000");
		if(i == s.b1.length-1){
			handle(s.b1[i-1].cx1, s.b1[i-1].cy1, s.b1[i-1].ax, s.b1[i-1].ay, "#00ff00");
		}
	}


}