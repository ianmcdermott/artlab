//userdrawn router
'use strict'
const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {UserDrawn} = require('./models');

const app = express();
router.use(bodyParser.json({limit: '50mb'}));
router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
const jwtAuth = passport.authenticate('jwt', {session: false});



router.get('/:id', jwtAuth, (req, res) =>{
	UserDrawn
		.findById(req.params.id)
		.then(userdrawn => res.json(userdrawn.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'})
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
	UserDrawn
		.find(filters)
		.then(userdrawn => {
			console.log("iya"+JSON.stringify(userdrawn));
			res.json({
				userdrawn: userdrawn.map(
					(userdrawn) => userdrawn.apiRepr())
			});
		})
		.catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'Internal Server Error'});
		});
});

router.post('/', jwtAuth, (req, res) =>{
	const requiredFields = ['frameNumber', 'frame', 'title', 'animationId', 'artist', 'creationDate', 'artistId'];
	for(let i=0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \'${field}\' in request body`
			console.error(message);
			res.status(400).send(message);
		}
	}

	UserDrawn
		.create({
			frameNumber: req.body.frameNumber,
			frame: req.body.frame,
			title: req.body.title,
			animationId: req.body.animationId,
			artist: req.body.artist,
			creationDate: req.body.creationDate,
			artistId: req.body.artistId
		})
		.then(
			userdrawn => res.status(201).json(userdrawn.apiRepr()))
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
	const updateableFields = ['id', 'frameNumber', 'frame', 'title', 'animationId', 'artist', 'creationDate', 'artistId'];

	updateableFields.forEach(field => {
		if(field in req.body){
			toUpdate[field] = req.body[field];
		}
	})

	UserDrawn
		.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.then(UserDrawn => {
			console.log("Updated");
			res.status(204).end();
		})
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', jwtAuth, (req, res) =>{
	UserDrawn
		.findByIdAndRemove(req.params.id)
		.then(userdrawn => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));	
});

router.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

module.exports = {router};
