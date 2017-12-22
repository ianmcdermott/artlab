'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');

const {router: usersRouter} = require('./users');
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');
const {router: animationRouter} = require('./animations');
const {router: userProfileRouter} = require('./userprofile');
const {router: userdrawnRouter} = require('./userdrawn');
// const {router: guideRouter} = require('./guide');
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

const app = express();

app.use(express.static('public'));

app.use(morgan('common'));
// app.use(cors());
app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
	if(req.method === 'OPTIONS'){
		return res.send(204);
	}
	next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/animations', animationRouter);
app.use('/userprofile', userProfileRouter);
app.use('/userdrawn', userdrawnRouter);
// app.use('/guide', userProfileRouter);

const jwtAuth = passport.authenticate('jwt', {session: false});

//use jwt to access endpoint with user data
app.get('/api/protected', jwtAuth, (req, res) =>{
	return res.json({
		data: 'Hello World'
	});
});


app.use('*', (req, res) =>{
	return res.status(404).json({message: 'Not Found'});
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${PORT}`);
           resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if(require.main === module){
	runServer().catch(e => console.error(e));
};

module.exports = {app, runServer, closeServer};
