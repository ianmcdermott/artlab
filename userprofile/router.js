//userProfile router
'use strict'
const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {Userprofile} = require('./models');

const app = express();
router.use(bodyParser.json());
const jwtAuth = passport.authenticate('jwt', {session: false});


router.get('/:id', jwtAuth, (req, res) =>{
	Userprofile
		.findById(req.params.id)
		.then(userProfile => res.json(userProfile.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'})
		});
});


router.get('/', jwtAuth, (req, res) => {
	const filters = {};
	const queryFields = ["username"];
	queryFields.forEach(field => {
		if(req.query[field]){
			filters[field] = req.query[field];
		}
	});
	Userprofile
		.find(filters)
		.then(userprofile => {
			res.json({
				userprofile: userprofile.map(
				(userprofile) => userprofile.apiRepr())
			});	
		})	
        .catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'Internal Server Error'});
		});
});


router.get('/', jwtAuth, (req, res) => {
	const filters = {};
	const queryFields = ["animationId", "artistId", "creationDate", "title"];
	queryFields.forEach(field => {
		if(field == "artistId") console.log('HI! 	'+field+":"+req.query[field]);
		if(req.query[field]){
			filters[field] = req.query[field];
		}
	});
	Userprofile
		.find(filters)
		.then(userprofile => {
			res.json({
				userprofile: userprofile.map(
					(userprofile) => userprofile.apiRepr())
			});
		})
		.catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'Internal Server Error'});
		});
});



router.post('/', (req, res) =>{
	const requiredFields = ['username', 'firstName', 'lastName', 'artwork', 'animations'];
	for(let i=0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \'${field}\' in request body`
			console.error(message);
			res.status(400).send(message);
		}
	}

	Userprofile
		.create({
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			artwork: req.body.artwork,
			animations: req.body.animations
		})
		.then(
			userProfile => res.status(201).json(userProfile.apiRepr()))
		.catch(err =>{
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
});



 router.put('/:id', jwtAuth, (req, res) => {
	if(!(req.params.id && req.body.id && req.params.id === req.body.id)){
		const message = (
			`Request path id (${req.params.id}) and request body id ` +
			`(${req.body.id}) must match`);
		console.error(message);
		return res.status(400).json({message: message});
	}

	const toUpdate = {};
	const updateableFields = ['username', 'firstName', 'lastName', 'artwork', 'animations'];

	updateableFields.forEach(field => {
		if(field in req.body){
			toUpdate[field] = req.body[field];
		}
	})

	Userprofile
		.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.then(Userprofile => {
			console.log("Updated");
			res.status(204).end();
		})
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', jwtAuth, (req, res) =>{
	Userprofile
		.findByIdAndRemove(req.params.id)
		.then(userProfile => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));	
});

router.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

module.exports = {router};
