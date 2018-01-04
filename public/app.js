let userArtworkObject = {};
let frameC;
let drawing = [];
frameC = 0;
let username;
let userId;

let AUTHORIZATION_CODE;
DATABASE_URL = '/';

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


// *Canvas* load guide image for the canvas and display canvas from sketch.js file
function getAndDisplayGuideImage(){
	console.log('getAndDisplayGuideImage ran');
	getAnimations(displayGuideImage);
}

function getAnimations(callback){
	console.log('getAnimations ran');

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

function displayGuideImage(data){
	console.log('displayGuideImage ran');
	$("body").append(`<script src="sketch.js" type="text/javascript"></script>`);
	new p5();
}


function prepCanvas(){
	$("#js-artwork-clear").click(event => event.preventDefault());
	retrieveLocalStorage();
	getGuideUrl();
	submitArtwork();
}


function renderGalleryAndShowcase(){
	retrieveLocalStorage();

	getAndRenderArtworkThumb();
    getAndRenderAnimationThumb();
}

function renderGallery(){
	retrieveLocalStorage();

	getAndRenderArtworkThumb();
	getAndRenderAnimationThumb();
	getAndRenderArtworkInfo();
	getAndRenderAnimationInfo();
	$("#js-animation-info").prepend(`<p>Image featured in:</p>`)
}


function getGuideUrl(){
	console.log('getGuideUrl ran');
	getAnimations(returnRandomGuideUrl);
}

function returnRandomGuideUrl(data){
	let r = Math.floor(Math.random()*data.animations.length)
	GUIDE_URL =  data.animations[r].guideUrl;
	extendUserArtworkObject(data, r);
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

function renderCredits(data){
	for(i = 0; i < data.length; i++){
		console.log(data[i].artist);
		$("#js-credits-holder").append(`<p>${data[i].artist}</p>`);
	}
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
	console.log('getArtworkByUserId ran '+userProfileId);
	const settings = {
		url:  DATABASE_URL+`userdrawn/`,
		data: {artistId: userProfileId},
		headers: {
			'Authorization': "Bearer "+ AUTHORIZATION_CODE,
		},
		success: callback,
		error: "Error getting userprofile info"
	};
	$.ajax(settings);
}

function getArtworkByAnimationId(callback){
	console.log('getArtworkByAnimationId ran '+DATABASE_URL+`userdrawn/`+userArtworkObject.id);
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

function getAndRenderAnimation(){
	console.log("getAndRenderAnimation ran")
	getArtworkByAnimationId(renderAnimation);
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
	userTheatre = data.userdrawn.sort(sortByFrameNumber);
	new p5(theatre, "js-theatre-holder");
	renderCredits(userTheatre);
}


function getAndRenderArtworkInfo(){
	getArtworkInfo(renderArtworkInfo);
}

function getArtworkInfo(callback){
	console.log("getArtworkInfo ran!!");
	const settings = {
		url:  `/userprofile/`+ username,
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
	animationId = data.artwork[0]
	$('#js-artwork-info').html(`
		<p>by ${data.userprofile[0].name}</p>
		<p>Created on: ${data.artwork[0].date}</p>`);
}

function renderShowcase(){
	console.log('renderShowcase ran');
	retrieveLocalStorage();
	getRandomAnimationFromUser();

}

function getAndRenderAnimationInfo(){
	console.log('getAndRenderAnimationInfo ran' + animationId)
	getAnimationInfoById(renderAnimationInfo);	
}



function getAnimationInfoById(callback){
	console.log('!!!getAnimationInfoById ran!!!'+animationId)
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

function renderAnimationInfo(data){
	console.log('renderAnimationInfo ran!!!')
	let lastDD = new Date(data.lastDrawnDate).toDateString();
	$('.plack-black-static').append(`
		<div id="js-animation-info">
			<p>${data.title}</p>
			<p>Last frame drawn on:</p><p>${lastDD}</p>
		</div>`);
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
	localStorage.userProfileId = data.userprofile[0].id;
	localStorage.artist = data.userprofile[0].name;
	console.log('gatherArtistInfo running'+data.userprofile[0].id);
	$.extend(userArtworkObject, {
		id: data.userprofile[0].id,
	    username: data.userprofile[0].username,
	    artist: data.userprofile[0].name,
	    userProfileId: data.userprofile[0].id
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
}

function gatherAnimationInfo(data){
	console.log('gatherAnimationInfo ran '+ data.animations[0].title);
	$.extend(userArtworkObject, {
	 	title : data.animations[0].title, 
	 	lastDrawnDate : data.animations[0].lastDrawnDate,
		lastFrame: data.animations[0].lastFrame,
	});		
}

function getRandomAnimation(){ 
 	return getRandomAnimationFromUser();
 	// getAnimations(extendUserArtworkObject);
}

function getRandomAnimationFromUser(){
 		return getUserId(returnRandomAnimation)
 	}

function extendUserArtworkObject(data, r){
	console.log("extendUserArtworkObject ran");
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
	console.log(JSON.stringify(data.userprofile[0].name));
	$('#js-user-header').html(`<p>Welcome ${data.userprofile[0].name}`);
}

function renderUserInfo(data){
	console.log('renderUserInfo running');
	$('#js-userinfo').html(data.userprofile[0].username);
}



//PUT new art on user profile to update image for thumbnail display purposes
function putArtworkUserProfile(callback, userID, artworkTitle, animationId){
	console.log('putArtwork ran' + drawing);	
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
			success: function(){
				callback;
				console.log('success!');
			},
			error: console.error('PUT drawing error')		
	};
	$.ajax(settings);
	return false;
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
		// let mainWidth = $(window).height()/1170;
		// $('main').('width', mainWidth);
		// let sketchHolderWidth = $('#js-sketch-holder').width();
		// $('#js-sketch-holder').height(sketchHolderWidth);
		// $('#js-artwork-thumb').height(sketchHolderWidth);

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
		console.log('retrieveLocalStorage!!!!' + animationId);

	if(!username){
		window.location.replace('login.html');
	}
}

function retrieveUsernameFromLocalStorage(){
	username = localStorage.getItem('username');
}


function retrieveUserArtworkObject(){
	userArtworkObject = localStorage.getItem('userArtworkObject');
}

/// CANVAS POSTING FUNCTIONS ///
function submitArtwork(){
	$('#js-artwork-form').on('submit', function(event){
		event.preventDefault();
		createUserdrawnObject();
		//putArtworkAnimations()
		updateAnimationObject(userArtworkObject.animationId, (Number(userArtworkObject.frameCount)+1));
		//get artwork object in userprofile, append, and put back in 
	});
}

function getAndUpdateUserProfile(){
	console.log('getAndUpdateUP ran');
	getUserId(appendUserAnimations);
	getUserId(appendUserArtwork);
	// getArtworkByDateAndTitle(appendUserArtwork, _creationDate, _title);
	// window.location.replace('/dashboard.html');
}

function returnRandomAnimation(data){
	let randomAnimationIndex = Math.floor(Math.random()*data.userprofile[0].animations.length);
	console.log('returning:'+data.userprofile[0].animations[randomAnimationIndex]);
	animationId = data.userprofile[0].animations[randomAnimationIndex];
	getAndRenderAnimation();
	getAndRenderAnimationInfo();
}

function appendUserAnimations(data){
	console.log('appendUserAnimations ran');
	let updatedAnimations = data.userprofile[0].animations;
	console.log('animation id is '+animationId);
	updatedAnimations.push(animationId);
	console.log('updatedAnimations  is '+updatedAnimations);

	// updatedAnimations.push(animationId);
	const settings = {
		url: '/userprofile/' + userId,
		method: 'PUT',
			data: JSON.stringify({
				"id": "5a42f6916062e314ccc00de6",
				"animations": updatedAnimations
			}),
			dataType: 'json',
			headers: {
				'Authorization': "Bearer "+ AUTHORIZATION_CODE,
				'Content-Type': 'application/json'
			},
			success: console.log('success PUT animation'+updatedAnimations[0]),
			error: console.error('PUT drawing error')		
	};
	$.ajax(settings);
}


function appendUserArtwork(data){
	let updatedArtwork = data.userprofile[0].artwork.push(artworkId);
	console.log('appendUserArtwork ran');
	const settings = {
		url: '/userprofile/' + userId,
		method: 'PUT',
			data: JSON.stringify({
				"id": "5a42f6916062e314ccc00de6",
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
	$("#js-password-submit").css('border', 'default');
	$("#js-retype-password").css('border', 'default');
	$("#js-username-submit").css('border', 'default');

	$('#js-register-user-form').submit(function(event){
		$("#alert").empty();
		$("#alert").hide();
		let registerBool = true;
		event.preventDefault();
		console.log('pword '+$("#js-password-submit").length)

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
			$("#js-password-submit").css('border', 'default');
			$("#js-retype-password").css('border', 'default');
			$("#js-username-submit").css('border', 'default');
			postNewUser(newUser, newPass, newFirst, newLast);
		}
		
	})
}

// •••• Alerts ••••  //
function fillFormAlert(newUser, newPass, newFirst, newLast){
	registerBool = false;
	if(!(newUser && newPass && newFirst && newLast)){
		$("#alert").append(`<p>Please fill out full form.</p>`);
	} else return;
}


function passwordDoesntMatchAlert(){
	registerBool = false;

	if($("#js-password-submit").val() !== $("#js-retype-password").val() ){
		$("#alert").append(`<p>Passwords don't match.</p>`);
		$("#js-password-submit").css('border', '6px solid #f00');
		$("#js-retype-password").css('border', '6px solid #f00');
		$("#alert").show();
	} else return;
}

function passwordTooLongAlert(){
	registerBool = false;

	if($("#js-password-submit").val().length < 10){
		$("#js-password-submit").css('border', '6px solid #f00');
		$("#alert").append(`<p>Password is too short, must be more than 10 characters.</p>`);
		$("#alert").show();

	} else return;
}

function passwordTooShortAlert(){
	registerBool = false;

	if($("#js-password-submit").val().length > 46){
		$("#js-password-submit").css('border', '6px solid #f00');
		$("#alert").append(`<p>Password is too long, must be less than 42 characters.</p>`);
		$("#alert").show();
	} else return;
}

function usernameTakenAlert(){
	registerBool = false;

	if($("#js-username-submit") === false){
		$("#js-username-submit").css('border', '6px solid #f00');
		$("#alert").append(`<p>Username Taken.</p>`);
		$("#alert").show();

	} else return;
}


function loginAlert(){
	$("#js-login-username").css('border', '6px solid #f00');
	$("#js-login-password").css('border', '6px solid #f00');
	$('#js-login-user-form').append(`<div class="alert"><p>Incorrect username or password</p></div>`);
}


function postNewUser(newUser, newPass, newFirst, newLast){
	console.log('postNewUser ran '+newUser);	
					console.log(DATABASE_URL + 'api/users')

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
				console.log(DATABASE_URL + '/api/users')
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
				console.log('replacing');
				$('#js-register-user-form').method = "POST"; 
				window.location.replace('/login.html');
			},
			error: console.error('POST postNewUserProfile error')		
	};
	$.ajax(settings);
}

function loginUser(){
	if(localStorage.username){
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

function userSettings(){
	logOut();
	deleteProfile();
	$("#js-logout").on('click', function(){
			console.log('User settings')

		localStorage.clear();
		window.location.replace('login.html')
	})
}

function logOut(){

	$("#js-logout").on('submit', function(){
			console.log('User settings')

		localStorage.clear();
		window.location.replace('login.html')
	})
}


//user makes POST to login get JWT
function postUserLogin(callback, un, pw){
	console.log(un);

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
			timeout: 10000,
			error: function(){

				console.log('error fool');
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
		error: console.error('error GET getUserId'+username)		
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
	if(drawing[0]){
		// getAndUpdateUserProfile();
		postUserDrawn(frameNumber, drawing, title, animationId, artist, creationDate, userId);
	} else {
		drawingAlert();
		console.log('no drawing');
	}
}

function drawingAlert(){
	return alert("Draw Something First!");
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
	return data.userprofile[0].name;
}

function getAndReturnAnimationId(){

}

function getAndReturnArtistName(){

}

function postUserDrawn(_frameNumber, drawing, _title, _animationId, _artist, _creationDate, _userId){
	console.log('postUserDrawn ran ' + drawing[0].lines);	
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
				"artistId": _userId
			}),
		dataType: 'json',
		headers: {
				'Authorization': "Bearer "+ AUTHORIZATION_CODE,
				'Content-Type': 'application/json'
			},
		success: function(data){
			console.log('data is'+data);
				artworkId = data._id;
				getAndUpdateUserProfile();
				
				// $("#js-artwork-form").unbind().submit();
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

let imageSketch = function(p){
	let canvasWidth = $("#js-artwork-thumb").width();
	let initialRadius = canvasWidth/20;
	let initialWidth = 1000;
	let responsiveRatio = initialWidth/canvasWidth;

	p.preload = function(){
	
	}

	p.windowResized = function(){
		canvasWidth = $("#js-artwork-thumb").width();
		p.resizeCanvas(canvasWidth,canvasWidth);
		initialRadius = canvasWidth/20;

	}


	p.setup = function() {
			p.createCanvas(canvasWidth, canvasWidth);
			// p.background('#a7edff');

			// p.displayDrawing();
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
				let radiusRatio = canvasWidth/initialWidth;
				let weightMap = weight*radiusRatio;

				if(lines){
					for(let j = 0; j < lines.length; j++){
						let c = userDrawing[i].color;
						p.strokeWeight(weightMap);
						p.stroke(c);
						let mXmap = p.map(lines[j].mouseX, 0, initialWidth, 0, canvasWidth);
						let mYmap = p.map(lines[j].mouseY, 0, initialWidth, 0, canvasWidth);
						let pXmap = p.map(lines[j].pmouseX, 0, initialWidth, 0, canvasWidth);
						let pYmap = p.map(lines[j].pmouseY, 0, initialWidth, 0, canvasWidth);
						p.line(mXmap, mYmap, pXmap, pYmap);

					}
				}
				if(points){
					for(let j = 0; j < points.length; j++){
						let mXmap = p.map(points[j].x, 0, initialWidth, 0, canvasWidth);
						let mYmap = p.map(points[j].y, 0, initialWidth, 0, canvasWidth);
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
	// let initialWidth = $("#js-theatre-holder").width();
	let canvasWidth = $("#js-theatre-holder").width();
	let initialRadius = canvasWidth/20;
	let initialWidth = 1000;
	let canvas;
	// let initialRadius = 50; 
	let responsiveRatio = initialWidth/canvasWidth;

	p.preload = function(){

	}

	p.windowResized = function(){
		canvasWidth = $("#js-artwork-thumb").width();
		p.resizeCanvas(canvasWidth,canvasWidth);
		initialRadius = canvasWidth/20;
	}


	p.setup = function() {
			canvas  = p.createCanvas(canvasWidth, canvasWidth);
			canvas.parent('#js-theatre-holder');
			console.log('Frame is '+canvasWidth)
			p.frameRate(12);

	}

	p.draw = function(){
		p.background('#a7edff');
		//if hovering mouse over canvas, it will pause at frame mapped to mouse position vs canvas size
		if(p.mouseX > 0 && p.mouseX < canvas.width && p.mouseY > 0 && p.mouseY < canvas.height){
			let m = Math.floor(p.map(Math.floor(p.mouseX), 0, canvas.width, 0, userTheatre.length));
			p.displayDrawing(userTheatre[m].frame);
		} else {
			p.displayDrawing(userTheatre[frameCount].frame);
			frameCount++;
			if(frameCount > userTheatre.length-1) frameCount = 0;
		}
	}

	p.displayDrawing = function(frame){
		if(userTheatre){
			for (let i = 0; i < frame.length; i++) {
		   		let lines = frame[i].lines;
		   		let points = frame[i].points;
				let weight = frame[i].radius;
				let radiusRatio = canvasWidth/initialWidth;
				let weightMap = weight*radiusRatio;

				if(lines){
					for(let j = 0; j < lines.length; j++){
						let c = frame[i].color;
						p.strokeWeight(weightMap);
						p.stroke(c);
						let mXmap = p.map(lines[j].mouseX, 0, initialWidth, 0, canvasWidth);
						let mYmap = p.map(lines[j].mouseY, 0, initialWidth, 0, canvasWidth);
						let pXmap = p.map(lines[j].pmouseX, 0, initialWidth, 0, canvasWidth);
						let pYmap = p.map(lines[j].pmouseY, 0, initialWidth, 0, canvasWidth);
						p.line(mXmap, mYmap, pXmap, pYmap);
					}
				}
				if(points){
					for(let j = 0; j < points.length; j++){
						let mXmap = p.map(points[j].x, 0, initialWidth, 0, canvasWidth);
						let mYmap = p.map(points[j].y, 0, initialWidth, 0, canvasWidth);
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
