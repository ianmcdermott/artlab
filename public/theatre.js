let numFrames = 239;
let images = [];
let currentFrame = 0;

 function preload(){
	for(let i = 0; i < numFrames; i++){
		let imageName = 'https://raw.githubusercontent.com/ianmcdermott/art-app/master/public/media/sequences-frames/flowerGuide_'+(('00000' + i).slice(-5))+'.png';
		images[i] = loadImage(imageName);
	}
 }

function setup(){
	let canvas = createCanvas(500, 500);
	frameRate(24);
	canvas.parent('js-theatre-holder');
}

function draw(){
	background(0);
		//images.size(50%);
	//let container = this.parent();
	//console.log('contain = ' +container);
	image(images[currentFrame], 0, 0, 500, 500);
	currentFrame++;
	if(currentFrame == images.length) currentFrame = 0;
}

