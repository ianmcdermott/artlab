//animations router
'use strict'
const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {Animations} = require('./models');

const app = express();
router.use(bodyParser.json());
const jwtAuth = passport.authenticate('jwt', {session: false});


router.get('/', jwtAuth, (req, res) => {
		Animations
		.find()
		.then(animations => {
			res.json({
				animations: animations.map(
					(animations) => animations.apiRepr())
			});
		})
		.catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'Internal Server Error'});
		});
});

router.get('/:id', jwtAuth, (req, res) =>{
	Animations
		.findById(req.params.id)
		.then(animations => res.json(animations.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'})
		});
});

router.post('/', jwtAuth, (req, res) =>{
	const requiredFields = ['title', 'lastDrawnDate', 'lastFrame', 'frameCount', 'guideUrl'];
	for(let i=0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \'${field}\' in request body`
			console.error(message);
			res.status(400).send(message);
		}
	}

	Animations
		.create({
			title: req.body.title,
			lastDrawnDate: req.body.lastDrawnDate,
			lastFrame: req.body.lastFrame,
			frameCount: req.body.frameCount,
			guideUrl: req.body.guideUrl
		})
		.then(
			animations => res.status(201).json(animations.apiRepr()))
		.catch(err =>{
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
});

router.put('/:id', jwtAuth, (req, res) => {
	if(!(req.params.id && req.body.id && req.params.id === req.body.id)){
		const message = (
			`Request path id (${req.params.id}) and request body id ` +
			`(${req.body.title}) must match`);
		console.error(message);
		return res.status(400).json({message: message});
	}

	const toUpdate = {};
	const updateableFields = ['title', 'lastDrawnDate', 'lastFrame', 'frameCount', 'guideUrl'];

	updateableFields.forEach(field => {
		if(field in req.body){
			toUpdate[field] = req.body[field];
		}
	})

	Animations
		.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.then(Animations => {
			console.log("Updated");
			res.status(204).end();
		})
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', jwtAuth, (req, res) =>{
	Animations
		.findByIdAndRemove(req.params.id)
		.then(animations => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));	
});

router.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

module.exports = {router};
