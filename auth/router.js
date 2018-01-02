
'use strict'
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const config = require('../config');
const router = express.Router();

const createAuthToken = user => {
	return jwt.sign({user}, config.JWT_SECRET, {
		subject: user.username,
		expiresIn: config.JWT_EXPIRY,
		algorithm: 'HS256'
	});
};

const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());
//exchange user/pass for jwt
router.post('/login', localAuth, (req, res) =>{
	const authToken = createAuthToken(req.user.apiRepr());
	res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});
//refresh jwt
router.post('/refresh', jwtAuth, (req, res) =>{
	const authToken = createAuthToken(req.user);
	res.json({authToken});
});

module.exports = {router}