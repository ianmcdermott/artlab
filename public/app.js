let imageSketch = function(p){
	let initialWidth = 1000;
	let initialRadius = 50; 
	p.preload = function(){

	}

	p.setup = function() {
			p.createCanvas($("#js-artwork-thumb").width(), $("#js-artwork-thumb").width());
			p.background(50, 800, 210);

			p.displayDrawing();
			p.noLoop();
			p.frameRate(15);
	}

	p.windowResized = function(){
		let w = $("#js-artwork-thumb").width();
	}

	p.displayDrawing = function(){
		if(userDrawing){

			for (let i = 0; i < userDrawing.length; i++) {

		   		let lines = userDrawing[i].lines;
		   		let points = userDrawing[i].points;
				let weight = userDrawing[i].radius;
				let radiusRatio = $("#js-artwork-thumb").width()/initialWidth;
				let weightMap = weight*radiusRatio;


				if(lines){
					for(let j = 0; j < lines.length; j++){
						let c = userDrawing[i].color;
						p.strokeWeight(weightMap);
						p.stroke(c);
						let mXmap = p.map(lines[j].mouseX, 0, initialWidth, 0, $("#js-artwork-thumb").width());
						let mYmap = p.map(lines[j].mouseY, 0, initialWidth, 0, $("#js-artwork-thumb").width());
						let pXmap = p.map(lines[j].pmouseX, 0, initialWidth, 0, $("#js-artwork-thumb").width());
						let pYmap = p.map(lines[j].pmouseY, 0, initialWidth, 0, $("#js-artwork-thumb").width());
						// p.line(lines[j].mouseX, lines[j].mouseY, lines[j].pmouseX, lines[j].pmouseY);
						p.line(mXmap, mYmap, pXmap, pYmap);

					}
				}
				if(points){
					for(let j = 0; j < points.length; j++){
						let mXmap = p.map(points[j].x, 0, initialWidth, 0, $("#js-artwork-thumb").width());
						let mYmap = p.map(points[j].y, 0, initialWidth, 0, $("#js-artwork-thumb").width());
						let c = userDrawing[i].color;
						p.noStroke();
						p.fill(c);
						p.ellipse(mXmap, mYmap, weightMap, weightMap);
					}
				}
			}
		}
	}
}

let theatre = function(p){
	let frameCount = 0;
	let initialWidth = 1000;
	let initialRadius = 50; 

	p.preload = function(){
	}

	p.windowResized = function(){
		p.resizeCanvas($("#js-theatre-holder").width(), $("#js-theatre-holder").width());
	}


	p.setup = function() {
			let canvas  = p.createCanvas($("#js-theatre-holder").width(), $("#js-theatre-holder").width());
			canvas.parent('#js-theatre-holder');
			p.frameRate(15);

	}

	p.draw = function(){

		p.background(50, 800, 210);
		p.displayDrawing(userTheatre[frameCount].frame);
		frameCount++;
		if(frameCount > userTheatre.length-1) frameCount = 0;
	}

	p.displayDrawing = function(frame){
		if(userTheatre){
			for (let i = 0; i < frame.length; i++) {

		   		let lines = frame[i].lines;
		   		let points = frame[i].points;
				let weight = frame[i].radius;
				let radiusRatio = $("#js-theatre-holder").width()/initialWidth;
				let weightMap = weight*radiusRatio;

				if(lines){
					for(let j = 0; j < lines.length; j++){
						let c = frame[i].color;
						p.strokeWeight(weightMap);
						p.stroke(c);
						let mXmap = p.map(lines[j].mouseX, 0, initialWidth, 0, $("#js-theatre-holder").width());
						let mYmap = p.map(lines[j].mouseY, 0, initialWidth, 0, $("#js-theatre-holder").width());
						let pXmap = p.map(lines[j].pmouseX, 0, initialWidth, 0, $("#js-theatre-holder").width());
						let pYmap = p.map(lines[j].pmouseY, 0, initialWidth, 0, $("#js-theatre-holder").width());
						// p.line(lines[j].mouseX, lines[j].mouseY, lines[j].pmouseX, lines[j].pmouseY);
						p.line(mXmap, mYmap, pXmap, pYmap);
					}
				}
				if(points){
					for(let j = 0; j < points.length; j++){
						let mXmap = p.map(points[j].x, 0, initialWidth, 0, $("#js-theatre-holder").width());
						let mYmap = p.map(points[j].y, 0, initialWidth, 0, $("#js-theatre-holder").width());
						let c = frame[i].color;
						p.noStroke();
						p.fill(c);
						p.ellipse(mXmap, mYmap, weightMap, weightMap);
					}
				}
			}
		}
	}
}

let userArtworkObject = {};
let frameC;
let drawing;
frameC = 0;
let username;
let userId;

let AUTHORIZATION_CODE;


const DATABASE_URL = "http://localhost:8080/";

let GUIDE_URL = 'media/sequences-frames/flowerGuide_';
const EXTENSION = '.png'
const testAnimationId = '5a1ee44fc270315d5f98e947';
let sequenceId = "5a24a1cec270315d5fca2021";
let userDrawing;
let userTheatre;
let userProfileId;
let animationId;
let frameNumber;
let artist;

// Update frame number in animations endpoint
//Make sure frame number is properly added to post userdrawn
// update animations id in animations endpoint
// get, append, put animations id to user profile endpoint after submit art
// put drawing to user profile endpoint after submit art  
// Make sure grabbing random frame is working

// *Canvas* load guide image for the canvas and display canvas from sketch.js file
function getAndDisplayGuideImage(){
	console.log('getAndDisplayGuideImage ran');
	getAnimations(displayGuideImage);
}

function getAnimations(callback){
	console.log('getAnimations ran');

	const settings = {
		url:  DATABASE_URL+`animations`,
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: "Error getting playlist"
	};
	$.ajax(settings)
}

function displayGuideImage(data){
	console.log('displayGuideImage ran');
	// frameC = data.animations[0].frameCount;
	$("body").append(`<script src="sketch.js" type="text/javascript"></script>`);
	new p5();
}


function prepCanvas(){
	retrieveLocalStorage();
	// retrieveUserArtworkObject();
	drawing = [];
	getRandomAnimation();
	submitArtwork();
}

function getAndReturnSequenceId(){
	getSequenceId(returnSequenceId)
}

function getSequenceId(callback){
	const settings = {
	 	contentType: "application/json",
		url:  DATABASE_URL+`sequences`,
		success: callback,
		error: callback(null)//"Error getting playlist"
	};
	$.ajax(settings);
}

function returnSequenceId(data){
	return data.sequences[0].id;
}

// *Canvas* GETs image for current guide from "guide image" key's array and displays through p5.js program
function getGuide(callback){
	const settings = {
	 	contentType: "application/json",
		url:  DATABASE_URL+`sequences`,
		success: callback,
		error: callback(null)//"Error getting playlist"
	};
	$.ajax(settings);
}

function returnGuide(data){
	return data.sequences[0].guide;
}

function displayGuide(data){
	return data['guide-frames'][data['drawn-frames'].length];
}

// *Canvas* POSTs to endpoint (Used for image on SEQUENCE and USER endpoints and ||title input|| to USER endpoint) 


// *Canvas* GETs "animationID" from ANIMATION endpoint and uses it to match "ID" found in sequence endpoint and POST to "drawn-frames" and "credits" keys 
function getAnimationID(callback){
	setTimeout(function(){callback()}, 100);
}

function returnAnimationId(data){
	return data.id;
}

// *Canvas* GETs animation ID to POST it to user's "artwork" key's "animationID" to endpoint (Used for image on SEQUENCE and USER endpoints and ||title input|| to USER endpoint) 


// *User Profile Settings* || Delete My Account || button is clicked and:
function deleteSelected(){
	$('#deleteAccountBtn').on('click', function(){
		const deletedUser = getUsername();
		deleteUser(deletedUser);
		anomymizeUser(deletedUser);
	});
}

function deleteUser(user){
	setTimeout(function(){}, 100)
}

// *User Profile Settings* gets username from user profile endpoint and anonymizes user name from SEQUENCE Endpoint
function anonymizeUser(user){
	getUsername(updateUserCredits);
}

function updateUserCredits(data){
	if(data.username = sequence.credits.username){
		updateSequence.username;
	}
	$('#credits').html;
}


//gets sequence and renders to p5js theatre
function getSequenceAndRender(){
	const animationId = getAnimationID(returnAnimationId)
	getSequence(animationId, renderTheatre);
}

//*Animation Showcase* GETs image sequence and posts in canvas players? made in p5.js
function getSequence(requestedId, callback){
	getSequence.forEach(item => {
		if(item.id === requestedId){
			setTimeout(function(){ callback(MOCK_SEQUENCE_UPDATES)})
		}
	})	
}

// GET and return value of framecount in sequence object

function renderGallery(){
	retrieveLocalStorage();
	getAndRenderArtworkThumb();
	getAndRenderAnimationThumb();
	getAndRenderArtworkInfo();
	getAndRenderAnimationInfo();
}

function getAndRenderArtworkThumb(){
	getArtworkByUserId(renderArtworkThumb);
}


function getArtwork(callback){
	console.log('getArtwork ran');
	const settings = {
		url:  DATABASE_URL+`userdrawn`,
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: "Error getting userprofile info"
	};
	$.ajax(settings);
}

function getArtworkByDateAndTitle(callback, _date, _title){
	console.log('getArtwork ran');
	const settings = {
		url:  DATABASE_URL+`userdrawn`,
		data: {
			"creationDate": _date,
			"title": _title
		},
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: "Error getting userprofile info"
	};
	$.ajax(settings);
}


function getArtworkByUserId(callback){
	console.log('getArtworkByUserId ran'+userProfileId);
	const settings = {
		url:  DATABASE_URL+`userdrawn/`,
		data: {userId: userProfileId},
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: "Error getting userprofile info"
	};
	$.ajax(settings);
}

function getArtworkByAnimationId(callback, AID){
	console.log('getArtworkThumb ran');
	const settings = {
		url:  DATABASE_URL+`userdrawn/`,
		data: {animationId: AID},
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: "Error getting userprofile info"
	};
	$.ajax(settings);
}

function renderArtworkThumb(data){
	console.log('renderArtworkThumb ran'+ JSON.stringify(data));
	//load user drawing into its own object to be more easily accessible in p5 code
	$('#js-artwork-info').html(`
		<p>${data.userdrawn[0].title}</p>
		<p>Created on: ${data.userdrawn[0].creationDate}</p>`);

	if(data.userdrawn[0]){
		userDrawing = data.userdrawn[0].frame;
		new p5(imageSketch, "js-artwork-thumb");
	} else {
		console.log('no data');
	}
}
//<p class='js-artwork-title'>${data.userProfile[0].artwork[0].title}</p>



function getAndRenderAnimationThumb(){
	getArtwork(renderAnimationThumb);
}
function renderAnimationThumb(data){
	console.log('renderAnimationThumb ran');
	let randomFrame = Math.floor(Math.random()*data.userdrawn.length); 
	userDrawing = data.userdrawn[randomFrame].frame;
	//load user drawing into its own object to be more easily accessible in p5 code
	new p5(imageSketch, "js-theatre-thumb");
}



function getAndRenderAnimation(chosenAnimation){
	getArtworkByAnimationId(renderAnimation, chosenAnimation);
}

function sortByFrameNumber(a,b) {
  if (a.frameNumber < b.frameNumber)
     return -1;
  if (a.frameNumber > b.frameNumber)
    return 1;
  return 0;
}


//renders animation using data from userdrawn endpoint
function renderAnimation(data){
	console.log('renderAnimationThumb ran');
	
	userTheatre = data.userdrawn.sort(sortByFrameNumber);
	console.log("U Theatre is "+JSON.stringify(userTheatre));
	//load user drawing into its own object to be more easily accessible in p5 code
	new p5(theatre);
	$('#js-theatre-holder').prepend(
			`<div class="js-theatre-holder"></div>
	`);	
}


function getAndRenderArtworkInfo(){
	getArtworkInfo(renderArtworkInfo);
}

function getArtworkInfo(callback){
	console.log("getArtworkInfo ran!!");
	const settings = {
		url:  DATABASE_URL+`userprofile/`+ username,
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: function(data){
			callback(data);
			console.log("hello");
		},
		error: "Error getting userprofile info"
	};
	$.ajax(settings);
}

function renderArtworkInfo(data){
	$('#js-artwork-info').html(`
		<p>by ${data.name}</p>
		<p>Created on: ${data.artwork[0].date}</p>`);
}

function renderShowcase(){
	console.log('renderShowcase ran');
	retrieveLocalStorage();
	getAndRenderAnimationInfo();
	getAndRenderAnimation(animationId);
}

function getAndRenderAnimationInfo(){
	console.log('getAndRenderAnimationInfo ran')
	getAnimationInfoById(renderAnimationInfo);	
}



function getAnimationInfoById(callback){
	console.log('getAnimationInfoById ran')
	const settings = {
		url:  DATABASE_URL+`animations/	`+animationId,
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: "Error getting userprofile info",
	};
	$.ajax(settings);
}

function renderAnimationInfo(data){
	let lastDD = new Date(data.lastDrawnDate).toDateString();
	$('#js-animation-info').html(`
		<p>${data.title}</p>
		<p>Last frame drawn on:</p><p>${lastDD}</p>`);
}


// *User Dashboard* GETs username, first/last name, and one random artwork to display on profile
function populateDashboard(data){
	console.log('populateDashboard ran');
	getAndGatherArtistInfo();
	retrieveLocalStorage();
	getAndRenderUsername();
	//if the user has artwork in their profile, render the artwork thumb
	getAndRenderArtworkThumb();
}

function getAndRenderUserThumb(){
	getArtworkByUserId(renderUserThumb);
}

//Gets data from userprofile endpoint, adds to userArtworkObject
function getAndGatherArtistInfo(){
	getUserProfile(gatherArtistInfo);
}


//Gets user profile based on username
function getUserProfile(callback){
	console.log('getUserProfilerunning::'+ username);
	const settings = {
		url:  DATABASE_URL+`userprofile/`,
		data: {username: username},
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: "Error getting userprofile info"
	};
	$.ajax(settings);
}

// Adds username, id, and name to userArtworkObject
function gatherArtistInfo(data){
	console.log(JSON.stringify(data));
	userProfileId = data.id;
	localStorage.userProfileId = data.id;
	localStorage.artist = data.name;
	console.log('gatherArtistInfo running'+data.id);
	$.extend(userArtworkObject, {
		id: data.id,
	    username: data.username,
	    artist: data.name,
	    userProfileId: data.id
	});


	//Use that info to get animation info and add to userArtworkObject
	getAndGatherAnimationInfo();
	// return userProfileObject;
}


function getAndGatherAnimationInfo(){
	getAnimationInfo(gatherAnimationInfo);
}

function getAnimationInfo(callback){
	console.log('getAnimationInfo ran');
	const settings = {
		url:  DATABASE_URL+`animations`,
		contentType: "application/json",
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: "Error getting playlist"
	};
	$.ajax(settings);
	//setTimeout(callback(MOCK_SEQUENCE_UPDATES), 100);
}

function gatherAnimationInfo(data){
	console.log('gatherAnimationInfo ran '+ data.animations[0].title);
	$.extend(userArtworkObject, {
	 	title : data.animations[0].title, 
	 	lastDrawnDate : data.animations[0].lastDrawnDate,
		lastFrame: data.animations[0].lastFrame,
	});

	getRandomAnimation();
		
}

function getRandomAnimation(){ 
	console.log("getRandomAnimation ran");
	getAnimations(extendUserArtworkObject);
}

function extendUserArtworkObject(data){
	console.log("extendUserArtworkObject ran");
	let r = Math.floor(Math.random(data.animations.length));
	animationId = data.animations[r].id;
	frameNumber = data.animations[r].frameCount;
	localStorage.animationId = animationId;
	$.extend(userArtworkObject, {
	   animationId: animationId,
	   frameCount: frameNumber
	});
	console.log("userArtworkObject::"+JSON.stringify(userArtworkObject));
	localStorage.userArtworkObject = userArtworkObject;

	new p5();
}

function getUserInfo(callback){
	console.log('getUsername running');
	const settings = {
		url:  DATABASE_URL+`userprofile`,
		success: callback,
		error: "Error getting userprofile info"
	};

	$.ajax(settings);
}


function renderUsername(data){
	console.log('renderUsername running');
	console.log(JSON.stringify(data.id));
	$('#js-user-header').html(`<p>Welcome ${data.name}`);
}

function renderUserInfo(data){
	console.log('renderUserInfo running');
	$('#js-userinfo').html(data.username);
}



//PUT new art on user profile to update image for thumbnail display purposes
function putArtworkUserProfile(callback, userID, artworkTitle, animationId){
	console.log('putArtwork ran');	
	const settings = {
		url: DATABASE_URL + 'userprofile/' + userID,
		method: 'PUT',
			data: JSON.stringify({
				"id": userID,
				"artwork": [{
					"frame": drawing,
		            "animationId": animationId,
		            "title": artworkTitle,
		            "creationDate": new Date()
	            }]
			}),
			dataType: 'json',
			headers: {
				'Authorization': "Bearer "+ AUTHORIZATION_CODE,
				'Content-Type': 'application/json'
			},
			success: function(){
				callback;
			},
			error: console.error('PUT drawing error')		
	};
	$.ajax(settings);
	return false;
}

//PUT new art on animation to update image for thumbnail display purposes
function putArtworkAnimations(){
	console.log('putArtwork ran');	
	const settings = {
		url: DATABASE_URL + 'animations/' + animationId,
		method: 'PUT',
			data: JSON.stringify({
				"frameCount": frameNumber,
				"lastFrame": drawing,
				"lastDrawnDate": Date()
			}),
			dataType: 'json',
			headers: {
				'Authorization': "Bearer "+ AUTHORIZATION_CODE,
				'Content-Type': 'application/json'
			},
			success: function(){
				//callback;
				return;
			},
			error: console.error('PUT Animation drawing error')		
	};
	$.ajax(settings);

}

//POST new art to sequences endpoint
function postArtworkSequences(callback, userID, artworkTitle, animationId){
	console.log('putArtwork ran');	
	const settings = {
		url: DATABASE_URL + 'userprofile/' + userID,
		method: 'POST',
			data: JSON.stringify({
				"id": userID,
				"artwork": [{
					"frame": drawing,
		            "animationId": animationId,
		            "title": artworkTitle,
		            "creationDate": new Date()
	            }]
			}),
			dataType: 'json',
			headers: {
				'Authorization': "Bearer "+ AUTHORIZATION_CODE,
				'Content-Type': 'application/json'
			},
			success: function(){
				callback;
				console.log('success!');
			},
			error: console.error('PUT drawing error')		
	};
	$.ajax(settings);
	return false;
}



function renderGalleryAndShowcase(){
	retrieveLocalStorage();
	getAndRenderArtworkThumb();
	getAndRenderAnimationThumb();
}

function renderImage(data){
	$('#js-view-gallery').append(`data.`);
}




function handleCss(){
	let sw = $('.square1').width();
		$('.square1').height(sw);
		$('.square2').height(sw);
		$('.square1').css('border-width',`${sw/10}px`);
		$('.square2').css('border-width',`${sw/10}px`);
		// $('#js-animation-thumb').width('100%');
		// $('#js-artwork-thumb').width('100%');
		$('canvas').height(sw*.95);
		$('canvas').width(sw*.95);
		$('canvas').css('margin', sw/100);
}

$(window).resize(function() {
		let sw = $('.square1').width();
		$('.square1').height(sw);
		$('.square2').height(sw);
		$('.square1').css('border-width',`${sw/10}px`);
		$('.square2').css('border-width',`${sw/10}px`);
		// $('#js-animation-thumb').width('100%');
		// $('#js-artwork-thumb').width('100%');
		$('canvas').height(sw*.95);
		$('canvas').width(sw*.95);
		$('canvas').css('margin', sw/100);


	});

function runApp(){
	handleCss();
	loadAuthToken();
}

function loadAuthToken(){
	AUTHORIZATION_CODE = localStorage.getItem('auth');
}

function retrieveLocalStorage(){
	AUTHORIZATION_CODE = localStorage.getItem('auth');
	username = localStorage.getItem('username');
	userEndpointId = localStorage.getItem('userEndpointId');
	userProfileId = localStorage.getItem('userProfileId');
	artist = localStorage.getItem('artist');
	animationId = localStorage.getItem('animationId');
}

function retrieveUsernameFromLocalStorage(){
	username = localStorage.getItem('username');
}


function retrieveUserArtworkObject(){
	userArtworkObject = localStorage.getItem('userArtworkObject');
}

/// CANVAS POSTING FUNCTIONS ///
function submitArtwork(){
	$('#js-artwork-form').submit(function(event){
		event.preventDefault();
		createUserdrawnObject();
		//putArtworkAnimations()
		updateAnimationObject(userArtworkObject.animationId, (Number(userArtworkObject.frameCount)+1));

		//get artwork object in userprofile, append, and put back in 
		getAndUpdateUserProfile
	});
}

function getAndUpdateUserProfile(){
	console.log('getAndUpdateUP ran');
	getUserId(appendUserArtworkAndAnimations);
	getArtworkByDateAndTitle(appendUserArtwork, _creationDate, _title);
}

function appendUserAnimations(data){
	let updatedAnimations = data.animations.append(animationId);

	const settings = {
		url: DATABASE_URL + 'userprofile/' + userId,
		method: 'PUT',
			data: JSON.stringify({
				"animations": updatedAnimations
			}),
			dataType: 'json',
			headers: {
				'Authorization': "Bearer "+ AUTHORIZATION_CODE,
				'Content-Type': 'application/json'
			},
			success: console.log('success PUT animation'),
			error: console.error('PUT drawing error')		
	};
	$.ajax(settings);
}


function appendUserArtwork(data){
	let updatedArtwork = data.userDrawn[0].id.append(artworkId);

	const settings = {
		url: DATABASE_URL + 'userprofile/' + userId,
		method: 'PUT',
			data: JSON.stringify({
				"artwork": updatedArtwork,
			}),
			dataType: 'json',
			headers: {
				'Authorization': "Bearer "+ AUTHORIZATION_CODE,
				'Content-Type': 'application/json'
			},
			success: console.log('success PUT animation'),
			error: console.error('PUT drawing error')		
	};
	$.ajax(settings);
}


function registerUser(){
	$('#js-register-user-form').submit(function(event){
		event.preventDefault();
		let newUser = $('#js-username-submit').val();
		let newPass = $('#js-password-submit').val();
		let newFirst = $('#js-firstName-submit').val();
		let newLast = $('#js-lastName-submit').val();
		//post new user and user profile
		postNewUser(newUser, newPass, newFirst, newLast);
	})
}

function postNewUser(newUser, newPass, newFirst, newLast){
	console.log('postNewUser ran '+newUser);	
	const settings = {
		url: DATABASE_URL + 'api/users',
		method: 'POST',
			data: JSON.stringify({
				"username": newUser,
				"password": newPass,
				"firstName": newFirst,
				"lastName": newLast
			}),
			dataType: 'json',
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(){
				postNewUserProfile(newUser, newFirst, newLast);
			},
			error: console.error('POST postNewUser error')		
	};
	$.ajax(settings);
}
//When clicking to make new art, get a random animation, and populate artwork object with animation id/last frame

function postNewUserProfile(newUser, newFirst, newLast){
	console.log('postNewUserProfile ran '+newUser);	
	const settings = {
		url: DATABASE_URL + 'userprofile',
		method: 'POST',
			data: JSON.stringify({
				"username": newUser,
				"firstName": newFirst,
				"lastName": newLast,
				"artwork": [""],
				"animations": [""]
			}),
			dataType: 'json',
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(){
				console.log('success POST postNewUserProfile');
				$("#js-register-user-form").unbind().submit();
			},
			error: console.error('POST postNewUserProfile error')		
	};
	$.ajax(settings);
}

function loginUser(){
	$('#js-login-user-form').submit(function(event){
		event.preventDefault();
		const un = $("#js-login-username").val();
		username = un;
		localStorage.username = username;

		const pw = $("#js-login-password").val();
		postUserLogin(storeAuth, un, pw);
	})
}

//user makes POST to login get JWT
function postUserLogin(callback, un, pw){
	const settings = {
		url: DATABASE_URL + 'api/auth/login',
		method: 'POST',
			data: JSON.stringify({
				"username": un,
				"password": pw
			}),
			dataType: 'json',
			headers: {
				'Content-Type': 'application/json'
			},
			success: callback,
			error: console.error('error POST postUserLogin')		
	};
	$.ajax(settings);	
}

//store user's auth token locally in order to access endpoints
function storeAuth(data){
	AUTHORIZATION_CODE = data.authToken;
	localStorage.auth = data.authToken;
	$("#js-login-user-form").unbind().submit();
}

function getUserId(callback){
	retrieveUsernameFromLocalStorage();
	const settings = {	
		url: DATABASE_URL + 'userprofile/',
		data: {username: username},
		method: 'GET',
		dataType: 'json',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': "Bearer "+ AUTHORIZATION_CODE

		},
		success: callback,
		error: console.error('error GET getUserId')		
	};

	$.ajax(settings);
}

 
// POST new userdrawn object
function createUserdrawnObject(){
	frameNumber = userArtworkObject.frameCount;
	// console.log(frameNumber);
	// POST drawing to frame to userdrawn endpoint
	// POST title to userdrawn
	let title = $("#js-title-form").val();
	if(title === undefined) title = 'Untitled';
	// POST username to userdrawn
	// POST animationId
	animationId = userArtworkObject.animationId;
	// POST artist name to userdrawn
	artist = artist;
	// POST user ID to userdrawn
	userId = userProfileId;
	// POST creationDate
	let creationDate = new Date();
	postUserDrawn(frameNumber, drawing, title, animationId, artist, creationDate, userId);
}




// Update animation object
function updateAnimationObject(animationId, frameNumber){
	console.log("Frame num "+frameNumber);
	console.log("updateAnimationObject ran, framenum is "+frameNumber);
	const settings = {
		url: DATABASE_URL + 'animations/' + animationId,
		method: 'PUT',
			data: JSON.stringify({
				"id": animationId,
				"frameCount": frameNumber,
				"lastFrame": drawing,
				"lastDrawnDate": Date()
			}),
			dataType: 'json',
			headers: {
				'Authorization': "Bearer "+ AUTHORIZATION_CODE,
				'Content-Type': 'application/json'
			},
			success: function(){
				return console.log('success PUT animation')	
			} ,
			error: console.error('PUT drawing error')		
	};
	$.ajax(settings);
}

function getAndReturnAnimationInfo(){
	getAndGatherAnimationInfo();
}



function getAndReturnArtistInfo(){
	getUserProfile(returnUserInfo);
}




function getAndRenderUsername(){
	getUserProfile(renderUsername);

}



function getAndReturnUsername(){
	getUserProfile(returnUsername);
}

function returnUsername(data){
	return data.name;
}

function getAndReturnAnimationId(){

}

function getAndReturnArtistName(){

}


function postUserDrawn(_frameNumber, drawing, _title, _animationId, _artist, _creationDate, _userId){
	console.log('postUserDrawn ran ' + _frameNumber);	
	const settings = {
		url: DATABASE_URL + 'userdrawn',
		method: 'POST',
			data: JSON.stringify({
				"frameNumber": _frameNumber,
				"frame": drawing,
			    "title": _title,
			    "animationId": _animationId,
			    "artist": _artist,
			    "creationDate": _creationDate,
				"userId": _userId
			}),
			dataType: 'json',
			headers: {
				'Authorization': "Bearer "+ AUTHORIZATION_CODE,
				'Content-Type': 'application/json'
			},
			success: function(){
				$("#js-artwork-form").unbind().submit();
			},
			error: console.error('POST userdrawn error')		
	};
	$.ajax(settings);
}

function deleteProfile(){
	retrieveLocalStorage();
	$('#js-delete-profile').click(event =>{
		event.preventDefault();
		//deleteProfileWarning();
		deleteUserProfile();
		deleteUser();
	})
}
				

//delete userprofile based on id
function deleteUserProfile(){
	console.log("deleteUserProfile ran " + userProfileId);
	const settings = {
	url: DATABASE_URL + 'userprofile/' + userProfileId,
		method: 'DELETE',
			dataType: 'json',
			headers: {
				'Authorization': "Bearer "+ AUTHORIZATION_CODE,
				'Content-Type': 'application/json'
			},
			success: function(){
				console.log('success DELETE user');
				return;
			},
			error: console.error('DELETE userprofile error')		
	};
	$.ajax(settings);
}

function deleteUser(){
	console.log("deleteUser ran "+username);
	const settings = {
		url: DATABASE_URL + 'api/users',
		method: 'DELETE',
		dataType: 'json',
		data: {username: username},
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
			'Content-Type': 'application/json'
		},
		success: function(){
			$("#js-delete-profile").unbind().submit();
		},
		error: console.error('DELETE user error')		
	};
	$.ajax(settings);
}


$(runApp)
