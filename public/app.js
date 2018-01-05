let userArtworkObject = {};
let frameC;
let drawing = [];
frameC = 0;
let username;
let userId;

let AUTHORIZATION_CODE;

let GUIDE_URL;
const EXTENSION = '.png'
let userDrawing;
let userTheatre;
let userProfileId;
let animationId;
let frameNumber;
let artist;
let artworkId;

// Update frame number in animations endpoint
//Make sure frame number is properly added to post userdrawn
// update animations id in animations endpoint
// get, append, put animations id to user profile endpoint after submit art
// put drawing to user profile endpoint after submit art  
// Make sure grabbing random frame is working

function getAnimations(callback){
	const settings = {
		url:  `/animations`,
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: "Error getting playlist"
	};
	$.ajax(settings)
}

// ***** // ***** // Page Load Functions // ***** // ***** // 
// Load/prep the canvas.html page
function prepCanvas(){
	$("#js-artwork-clear").click(event => event.preventDefault());
	retrieveLocalStorage();
	getGuideUrl();
	submitArtwork();
}

// Render gallery and showcase for pick.html page
function renderGalleryAndShowcase(){
	retrieveLocalStorage();
	getAndRenderArtworkThumb();
    getAndRenderAnimationThumb();
}

// Render gallery for gallery.html page
function renderGallery(){
	retrieveLocalStorage();
	getAndRenderArtworkThumb();
	getAndRenderAnimationThumb();
	getAndRenderArtworkInfo();
	getAndRenderAnimationInfo();
	$("#js-animation-info").prepend(`<p>Image featured in:</p>`)
}

// Render animation and credits for showcase.html page
function renderShowcase(){
	retrieveLocalStorage();
	getRandomAnimationFromUser();
}

// Load userSettings on settings page
function loadUserSettings(){
	logOut();
	deleteProfile();
	//listen for click of logout button
	$("#js-logout").on('click', function(){
		localStorage.clear();
		window.location.replace('login.html')
	})
}

// Register user
function registerUser(){
	// Reset alert borders

	$("#js-password-submit").css('border', 'default');
	$("#js-retype-password").css('border', 'default');
	$("#js-username-submit").css('border', 'default');
	$(".alert").hide();

	//listen for register user form submit
	$('#js-register-user-form').submit(function(event){
		$(".alert").empty();
		$(".alert").hide();
		let registerBool = true;
		event.preventDefault();

		let newUser = $('#js-username-submit').val();
		let newPass = $('#js-password-submit').val();
		let newFirst = $('#js-firstName-submit').val();
		let newLast = $('#js-lastName-submit').val();
		fillFormAlert(newUser, newPass, newFirst, newLast);
		passwordDoesntMatchAlert();
		passwordTooLongAlert();
		passwordTooShortAlert();

		//post new user and user profile
		if(newUser && newPass && newFirst && newLast && registerBool){
			// Reset alert borders
			$("#js-password-submit").css('border', 'default');
			$("#js-retype-password").css('border', 'default');
			$("#js-username-submit").css('border', 'default');
			// Post new user to users endpoint
			postNewUser(newUser, newPass, newFirst, newLast);
		}	
	})
}

// Get url for guide image
function getGuideUrl(){
	getAnimations(returnRandomGuideUrl);
}

// Renturn a guide selected randomly from animations
function returnRandomGuideUrl(data){
	let r = Math.floor(Math.random()*data.animations.length)
	GUIDE_URL =  data.animations[r].guideUrl;
	extendUserArtworkObject(data, r);
}

// *Canvas* GETs image for current guide from "guide image" key's array and displays through p5.js program
function getGuide(callback){
	const settings = {
	 	contentType: "application/json",
		url:  `/sequences`,
		success: callback,
		error: callback(null)//"Error getting playlist"
	};
	$.ajax(settings);
}

// Render credits to showcase page
function renderCredits(data){
	for(i = 0; i < data.length; i++){
		$("#js-credits-holder").append(`<p>${data[i].artist}</p>`);
	}
}

// Get and render the artwork thumb
function getAndRenderArtworkThumb(){
	getArtworkByUserId(renderArtworkThumb);
}

// Get and render the animation thumb
function getAndRenderAnimationThumb(){
	getArtwork(renderAnimationThumb);
}

// Get artwork from userdrawn endpoint
function getArtwork(callback){
	const settings = {
		url:  `/userdrawn/`,
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: "Error getting userprofile info"
	};
	$.ajax(settings);
}

// Get artwork using date and title params
function getArtworkByDateAndTitle(callback, _date, _title){
	const settings = {
		url:  `/userdrawn`,
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

// Get artwork by user Id
function getArtworkByUserId(callback){
	const settings = {
		url: `/userdrawn/`,
		data: {artistId: userProfileId},
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: "Error getting userprofile info"
	};
	$.ajax(settings);
}

// Get artwork by its animation Id
function getArtworkByAnimationId(callback){
	const settings = {
		url:  `/userdrawn/`,
		data: {animationId: userArtworkObject.id},
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: "Error getting userprofile info"
	};
	$.ajax(settings);
}

// Render the artwork thumb
function renderArtworkThumb(data){
	let rand = Math.floor(Math.random()*data.userdrawn.length)
	let cDate = new Date(data.userdrawn[rand].creationDate).toDateString();

	//load user drawing into its own object to be more easily accessible in p5 code
	$('#js-artwork-info').html(`
		<p>${data.userdrawn[rand].title}</p>
		<p>Created on:</p><p>${cDate}</p>`);
	if(data.userdrawn){	
		userDrawing = data.userdrawn[rand].frame;
		new p5(imageSketch, "js-artwork-thumb");
	} else {
		console.log('no data');
	}
}

// Render the animation thumb
function renderAnimationThumb(data){
	let randomFrame = Math.floor(Math.random()*data.userdrawn.length); 
	userDrawing = data.userdrawn[randomFrame].frame;
	//load user drawing into its own object to be more easily accessible in p5 code
	new p5(imageSketch, "js-theatre-thumb");
}

// Get and render the animation
function getAndRenderAnimation(){
	getArtworkByAnimationId(renderAnimation);
}

//renders animation using data from userdrawn endpoint
function renderAnimation(data){
	userTheatre = data.userdrawn.sort(sortByFrameNumber);
	new p5(theatre, "js-theatre-holder");
	renderCredits(userTheatre);
}

// In case database entries get mixed, up, sort each entry by their frame number
function sortByFrameNumber(a,b) {
  if (a.frameNumber < b.frameNumber)
     return -1;
  if (a.frameNumber > b.frameNumber)
    return 1;
  return 0;
}

// Retrieve and render artwork info
function getAndRenderArtworkInfo(){
	getArtworkInfo(renderArtworkInfo);
}

// Get artwork info from user's profile by username
function getArtworkInfo(callback){
	const settings = {
		url:  `/userprofile/`+ username,
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: function(data){
			callback(data);
		},
		error: "Error getting userprofile info"
	};
	$.ajax(settings);
}

// Render artwork info to js-artwork-info div 
function renderArtworkInfo(data){
	animationId = data.artwork[0]
	$('#js-artwork-info').html(`
		<p>by ${data.userprofile[0].name}</p>
		<p>Created on: ${data.artwork[0].date}</p>`);
}

// Get and render animation info by Id
function getAndRenderAnimationInfo(){
	getAnimationInfoById(renderAnimationInfo);	
}

// Get animation info by Id
function getAnimationInfoById(callback){
	const settings = {
		url:  `/animations/	`+ animationId,
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: "Error getting userprofile info",
	};
	$.ajax(settings);
}

// Render animation info to .place-black-static class
function renderAnimationInfo(data){
	let lastDD = new Date(data.lastDrawnDate).toDateString();
	$('.plack-black-static').append(`
		<div id="js-animation-info">
			<p>${data.title}</p>
			<p>Last frame drawn on:</p><p>${lastDD}</p>
		</div>`);
}


// *User Dashboard* GETs username, first/last name, and one random artwork to display on profile
function populateDashboard(data){
	getAndGatherArtistInfo();
	retrieveLocalStorage();
	getAndRenderUsername();
	//if the user has artwork in their profile, render the artwork thumb
	getAndRenderArtworkThumb();
}

//Gets data from userprofile endpoint, adds to userArtworkObject
function getAndGatherArtistInfo(){
	getUserProfile(gatherArtistInfo);
}

//Gets user profile based on username
function getUserProfile(callback){
	const settings = {
		url: `/userprofile/`,
		data: {username: username},
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: "Error getting userprofile info"
	};
	$.ajax(settings);
}

// Adds username, id, artist name, and userprofile id to userArtworkObject
function gatherArtistInfo(data){
	userProfileId = data.id;
	localStorage.userProfileId = data.userprofile[0].id;
	localStorage.artist = data.userprofile[0].name;
	$.extend(userArtworkObject, {
		id: data.userprofile[0].id,
	    username: data.userprofile[0].username,
	    artist: data.userprofile[0].name,
	    userProfileId: data.userprofile[0].id
	});
	//Use that info to get animation info and add to userArtworkObject
	getAndGatherAnimationInfo();
}
// Get and Gather Animation info
function getAndGatherAnimationInfo(){
	getAnimationInfo(gatherAnimationInfo);
}

// Get Animation info from animations endpoint
function getAnimationInfo(callback){
	const settings = {
		url:  `/animations`,
		contentType: "application/json",
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: console.log("Error getting animation info")
	};
	$.ajax(settings);
}

// Add animation info to userArtworkObject
function gatherAnimationInfo(data){
	$.extend(userArtworkObject, {
	 	title : data.animations[0].title, 
	 	lastDrawnDate : data.animations[0].lastDrawnDate,
		lastFrame: data.animations[0].lastFrame,
	});		
}

// Get a random animation from the userprofile endpoint and return a random animation id
function getRandomAnimationFromUser(){
 	getUserId(returnRandomAnimation)
}

// Add animationId and framecount to user artwork object after getting animation from userprofiles endpoint
function extendUserArtworkObject(data, r){
	animationId = data.animations[r].id;
	frameNumber = data.animations[r].frameCount;
	localStorage.animationId = animationId;
	$.extend(userArtworkObject, {
	   animationId: animationId,
	   frameCount: frameNumber
	});
	localStorage.userArtworkObject = userArtworkObject;

	new p5();
}

// Render the username to #js-user-header div
function renderUsername(data){
	$('#js-user-header').html(`<p>Welcome ${data.userprofile[0].name}`);
}

//PUT new art on user profile to update image for thumbnail display purposes
function putArtworkUserProfile(callback, userID, artworkTitle, animationId){
	const settings = {
		url: 'userprofile/' + userArtworkObject.id,
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
			error: console.error('PUT drawing error'+JSON.stringify(drawing))		
	};
	$.ajax(settings);
	return false;
}

//PUT new art on animation to update image for thumbnail display purposes
function putArtworkAnimations(){
	const settings = {
		url: '/animations/' + animationId,
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
	const settings = {
		url: '/userprofile/' + userID,
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
			success: callback,
			error: console.error('PUT drawing error')		
	};
	$.ajax(settings);
}

/// CANVAS POSTING FUNCTIONS ///
// Submit artwork data to DB on click of canvas.html's submit button
function submitArtwork(){
	$('#js-artwork-form').on('submit', function(event){
		event.preventDefault();
		createUserdrawnObject();
		updateAnimationObject(userArtworkObject.animationId, (Number(userArtworkObject.frameCount)+1));
	});
}

// Get and update the user profile with new animation and artwork ID
function getAndUpdateUserProfile(){
	getUserId(appendUserAnimations);
	// getUserId(appendUserArtwork);
	window.location.replace('pick.html');
}

// Return a random animation from user profile's animation property
function returnRandomAnimation(data){
	let randomAnimationIndex = Math.floor(Math.random()*data.userprofile[0].animations.length);
	// animationId = data.userprofile[0].animations[randomAnimationIndex];
	getAndRenderAnimation();
	getAndRenderAnimationInfo();
}

// Append user Animations id's to property at userprofile endpoint
function appendUserAnimations(data){
	// append animations array after getting it from userprofile endpoint
	let updatedAnimations = data.userprofile[0].animations.push(animationId);
	// And put it back 
	const settings = {
		url: '/userprofile/' + userId,
		method: 'PUT',
			data: JSON.stringify({
				"id": userId,
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

// // Append user's artwork id's to property at userprofile endpoint
// function appendUserArtwork(data){
// 	// append artwork array after getting it from userprofile endpoint
// 	let updatedArtwork = data.userprofile[0].artwork.push(artworkId);
// 	// And put it back 
// 	const settings = {
// 		url: '/userprofile/' + userId,
// 		method: 'PUT',
// 			data: JSON.stringify({
// 				"id": userId,
// 				"artwork": updatedArtwork,
// 			}),
// 			dataType: 'json',
// 			headers: {
// 				'Authorization': "Bearer "+ AUTHORIZATION_CODE,
// 				'Content-Type': 'application/json'
// 			},
// 			success: console.log('success PUT animation'),
// 			error: console.error('PUT drawing error')		
// 	};
// 	$.ajax(settings);
// }

// •••• Alerts ••••  //
// Form empty alert
function fillFormAlert(newUser, newPass, newFirst, newLast){
	registerBool = false;
	if(!(newUser && newPass && newFirst && newLast)){
		$("#alert").append(`<p>Please fill out full form.</p>`);
	} else return;
}

//Not matching passwords alert
function passwordDoesntMatchAlert(){
	registerBool = false;

	if($("#js-password-submit").val() !== $("#js-retype-password").val() ){
		$("#alert").append(`<p>Passwords don't match.</p>`);
		$("#js-password-submit").css('border', '6px solid #f00');
		$("#js-retype-password").css('border', '6px solid #f00');
		$("#alert").show();
	} else return;
}

//Password too long alert
function passwordTooLongAlert(){
	registerBool = false;

	if($("#js-password-submit").val().length < 10){
		$("#js-password-submit").css('border', '6px solid #f00');
		$("#alert").append(`<p>Password is too short, must be more than 10 characters.</p>`);
		$("#alert").show();

	} else return;
}

// Password too short alert
function passwordTooShortAlert(){
	registerBool = false;

	if($("#js-password-submit").val().length > 46){
		$("#js-password-submit").css('border', '6px solid #f00');
		$("#alert").append(`<p>Password is too long, must be less than 42 characters.</p>`);
		$("#alert").show();
	} else return;
}

// Username already taken alert
function usernameTakenAlert(){
	registerBool = false;

	if($("#js-username-submit") === false){
		$("#js-username-submit").css('border', '6px solid #f00');
		$("#alert").append(`<p>Username Taken.</p>`);
		$("#alert").show();

	} else return;
}

//Login user alert
function loginAlert(){
	$("#js-login-username").css('border', '6px solid #f00');
	$("#js-login-password").css('border', '6px solid #f00');
	$('#js-login-user-form').append(`<div class="alert"><p>Incorrect username or password</p></div>`);
}

// Alert if no drawing has been made
function drawingAlert(){
	return alert("Draw Something First!");
}

//Post a new user to api/users endpoint
function postNewUser(newUser, newPass, newFirst, newLast){
	const settings = {
		url: '/api/users',
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

//Post a new user to the userprofiles endpoint
function postNewUserProfile(newUser, newFirst, newLast){
	const settings = {
		url: '/userprofile',
		method: 'POST',
			data: JSON.stringify({
				"username": newUser,
				"firstName": newFirst,
				"lastName": newLast,
				"artwork": [],
				"animations": []
			}),
			dataType: 'json',
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(){
				$('#js-register-user-form').method = "POST"; 
				window.location.replace('login.html');
			},
			error: console.error('POST postNewUserProfile error')		
	};
	$.ajax(settings);
}

// Login the user
function loginUser(){
	if(localStorage.username){
		//sign in if stored in local storage
		window.location.replace('dashboard.html');
	} else {
		$('#js-login-user-form').on('submit', function(event){
			event.preventDefault();
			$(".alert").remove();
			const un = $("#js-login-username").val().trim();
			username = un;
			localStorage.username = username;

			const pw = $("#js-login-password").val();
			postUserLogin(storeAuth, un, pw);
		})
	}
}

// Listen for logout button submit
function logOut(){
	$("#js-logout").on('submit', function(){
		localStorage.clear();
		window.location.replace('login.html')
	})
}


//user makes POST to login get JWT
function postUserLogin(callback, un, pw){
	const settings = {
		url: '/api/auth/login',
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
			timeout: 10000,
			error: function(){
				loginAlert();
			}	
	};
	$.ajax(settings);	
}

//store user's auth token locally in order to access endpoints
function storeAuth(data){
	AUTHORIZATION_CODE = data.authToken;
	localStorage.auth = data.authToken;
	window.location.replace('/dashboard.html');
}

// Get user's Id
function getUserId(callback){
	retrieveUsernameFromLocalStorage();
	const settings = {	
		url: '/userprofile/',
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
	if(drawing[0]){
		postUserDrawn(frameNumber, drawing, title, animationId, artist, creationDate, userId);
	} else {
		drawingAlert();
	}
}

// Update animation object
function updateAnimationObject(animationId, frameNumber){
	const settings = {
		url: '/animations/' + animationId,
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
			success: console.log('success PUT animation'),
			error: console.error('PUT drawing error')		
	};
	$.ajax(settings);
}

// Get and render username
function getAndRenderUsername(){
	getUserProfile(renderUsername);
}

// post userdrawn object info to userdrawn endpoint
function postUserDrawn(_frameNumber, drawing, _title, 
					   _animationId, _artist, _creationDate, _userId){
	const settings = {
		url: '/userdrawn/',
		method: 'POST',
		data: JSON.stringify({
				"frameNumber": _frameNumber,
				"frame": drawing,
			    "title": _title,
			    "animationId": _animationId,
			    "artist": _artist,
			    "creationDate": _creationDate,
				"artistId": _userId
			}),
		dataType: 'json',
		headers: {
				'Authorization': "Bearer "+ AUTHORIZATION_CODE,
				'Content-Type': 'application/json'
			},
		success: function(data){
				artworkId = data._id;
				getAndUpdateUserProfile();
			},
		error: console.error('POST userdrawn error')		
	};
	$.ajax(settings);
}

// Delete user's profile after click event
function deleteProfile(){
	retrieveLocalStorage();
	$('#js-delete-profile').click(event =>{
		event.preventDefault();
		//deleteProfileWarning();
		deleteUserProfile();
		deleteUser();
	})
}
				

//delete userprofile based on id from userprofile endpoint
function deleteUserProfile(){
	const settings = {
	url: '/userprofile/' + userProfileId,
		method: 'DELETE',
			dataType: 'json',
			headers: {
				'Authorization': "Bearer "+ AUTHORIZATION_CODE,
				'Content-Type': 'application/json'
			},
			success: console.log('success DELETE user'),
			error: console.error('DELETE userprofile error')		
	};
	$.ajax(settings);
}

// Delete user from users endpoint
function deleteUser(){
	const settings = {
		url: '/api/users',
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

// ***** // ***** // Storage Essentials // ***** // ***** //
// Retrieve locally stored variables
function retrieveLocalStorage(){
	AUTHORIZATION_CODE = localStorage.getItem('auth');
	username = localStorage.getItem('username');
	userEndpointId = localStorage.getItem('userEndpointId');
	userProfileId = localStorage.getItem('userProfileId');
	artist = localStorage.getItem('artist');
	animationId = localStorage.getItem('animationId');

	if(!username){
		window.location.replace('login.html');
	}
}

// Retrieve just username from local storage
function retrieveUsernameFromLocalStorage(){
	username = localStorage.getItem('username');
}

// Load auth token from localStorage
function loadAuthToken(){
	AUTHORIZATION_CODE = localStorage.getItem('auth');
}

// Handle css responsiveness
function handleCss(){
	let sw = $('.square1').width();
		$('.square1').height(sw);
		$('.square2').height(sw);
		$('.square1').css('border-width',`${sw/10}px`);
		$('.square2').css('border-width',`${sw/10}px`);
		$('canvas').height(sw*.95);
		$('canvas').width(sw*.95);
		$('canvas').css('margin', sw/100);
}

// Handle layout responsiveness 
$(window).resize(function() {
	let sw = $('.square1').width();
	$('.square1').height(sw);
	$('.square2').height(sw);
	$('.square1').css('border-width',`${sw/10}px`);
	$('.square2').css('border-width',`${sw/10}px`);
});

//Run the application
function runApp(){
	handleCss();
	loadAuthToken();
}

$(runApp)

// P5 sketch to display a single image
let imageSketch = function(p){
	let canvasWidth = $("#js-artwork-thumb").width();
	let initialRadius = canvasWidth/20;
	// Max width under current bootstrap settings is 1110 
	let maxWidth = 1110;
	// Ratio to convert between different sized windows
	let responsiveRatio = maxWidth/canvasWidth;

	p.windowResized = function(){
		canvasWidth = $("#js-artwork-thumb").width();
		p.resizeCanvas(canvasWidth,canvasWidth);
		initialRadius = canvasWidth/20;
	}

	p.setup = function() {
			p.createCanvas(canvasWidth, canvasWidth);
			p.noLoop();
			p.frameRate(15);
	}

	p.draw = function(){
		p.background('#a7edff');
		p.displayDrawing();
	}

	p.displayDrawing = function(){
		if(userDrawing){
			for (let i = 0; i < userDrawing.length; i++) {
		   		let lines = userDrawing[i].lines;
		   		let points = userDrawing[i].points;
				let weight = userDrawing[i].radius;
				let radiusRatio = canvasWidth/maxWidth;
				let weightMap = weight*radiusRatio;

				if(lines){
					for(let j = 0; j < lines.length; j++){
						let c = userDrawing[i].color;
						p.strokeWeight(weightMap);
						p.stroke(c);
						let mXmap = p.map(lines[j].mouseX, 0, maxWidth, 0, canvasWidth);
						let mYmap = p.map(lines[j].mouseY, 0, maxWidth, 0, canvasWidth);
						let pXmap = p.map(lines[j].pmouseX, 0, maxWidth, 0, canvasWidth);
						let pYmap = p.map(lines[j].pmouseY, 0, maxWidth, 0, canvasWidth);
						p.line(mXmap, mYmap, pXmap, pYmap);

					}
				}
				if(points){
					for(let j = 0; j < points.length; j++){
						let mXmap = p.map(points[j].x, 0, maxWidth, 0, canvasWidth);
						let mYmap = p.map(points[j].y, 0, maxWidth, 0, canvasWidth);
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

// P5 sketch to display animation of combined frames
let theatre = function(p){
	let frameCount = 0;
	let canvasWidth = $("#js-theatre-holder").width();
	let initialRadius = canvasWidth/20;
	// Max width under current bootstrap settings is 1110 
	let maxWidth = 1110;
	let canvas;
	// Ratio to convert between different sized windows
	let responsiveRatio = maxWidth/canvasWidth;

	p.windowResized = function(){
		canvasWidth = $("#js-artwork-thumb").width();
		p.resizeCanvas(canvasWidth,canvasWidth);
		initialRadius = canvasWidth/20;
	}

	p.setup = function() {
			canvas  = p.createCanvas(canvasWidth, canvasWidth);
		// Add to #js-theatre-holder div
			canvas.parent('#js-theatre-holder');
			p.frameRate(12);
	}

	p.draw = function(){
		p.background('#a7edff');
		//if hovering mouse over canvas, it will pause at frame mapped to mouse position vs canvas size
		if(p.mouseX > 0 && p.mouseX < canvas.width && p.mouseY > 0 && p.mouseY < canvas.height){
			let m = Math.floor(p.map(Math.floor(p.mouseX), 0, canvas.width, 0, userTheatre.length));
			p.displayDrawing(userTheatre[m].frame);
		} else {
		// If frame count reaches limit, go back to 0 
			p.displayDrawing(userTheatre[frameCount].frame);
			frameCount++;
			if(frameCount > userTheatre.length-1) frameCount = 0;
		}
	}

	//Function that takes data from frame object and converts into image
	p.displayDrawing = function(frame){
		if(userTheatre){
			for (let i = 0; i < frame.length; i++) {
		   		let lines = frame[i].lines;
		   		let points = frame[i].points;
				let weight = frame[i].radius;
				let radiusRatio = canvasWidth/maxWidth;
				let weightMap = weight*radiusRatio;

				if(lines){
					for(let j = 0; j < lines.length; j++){
						let c = frame[i].color;
						p.strokeWeight(weightMap);
						p.stroke(c);
						let mXmap = p.map(lines[j].mouseX, 0, maxWidth, 0, canvasWidth);
						let mYmap = p.map(lines[j].mouseY, 0, maxWidth, 0, canvasWidth);
						let pXmap = p.map(lines[j].pmouseX, 0, maxWidth, 0, canvasWidth);
						let pYmap = p.map(lines[j].pmouseY, 0, maxWidth, 0, canvasWidth);
						p.line(mXmap, mYmap, pXmap, pYmap);
					}
				}
				if(points){
					for(let j = 0; j < points.length; j++){
						let mXmap = p.map(points[j].x, 0, maxWidth, 0, canvasWidth);
						let mYmap = p.map(points[j].y, 0, maxWidth, 0, canvasWidth);
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
