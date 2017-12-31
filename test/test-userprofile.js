'use strict'
const chai = require('chai');
chai.use(require('chai-datetime'));
chai.use(require('chai-moment'));

const chaiHttp = require('chai-http');

const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');

//const expect = chai.expect;
const should = chai.should();

const {Userprofile} = require('../userprofile/models');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../config');

chai.use(chaiHttp);

function generateToken(){
	const username = 'exampleUser';
	const password = 'examplePass';
	const firstName = 'First';
	const lastName = 'Last';

	const token = jwt.sign(
			{
				user: {	username,
						firstName,
						lastName},
			},
				JWT_SECRET,
			{
				algorithm: 'HS256',
				subject: username,
				expiresIn: '7d'
			}
		);
	return token;
}

function generateUserProfileData(){
	const fn = faker.name.firstName();
  	const ln = faker.name.lastName();
	return {
		username: faker.internet.userName(),
  		firstName: fn,
  		lastName: ln,
	    artwork: [faker.random.alphaNumeric(24), faker.random.alphaNumeric(24), faker.random.alphaNumeric(24)],
	    animations: [faker.random.alphaNumeric(24), faker.random.alphaNumeric(24), faker.random.alphaNumeric(24)],
	    name: fn+" "+ln
	}
}

function tearDownDB(){
	return mongoose.connection.dropDatabase()
}

function seedUserProfileData(){
	console.info('Seeding database');
	const seedData = [];

	for(let i=1; i<= 10; i++){
		seedData.push(generateUserProfileData());
	}
	return Userprofile.insertMany(seedData);
}

describe('Userprofile API resource', function(){

	before(function(){
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function(){
		return seedUserProfileData();
	});

	afterEach(function(){
		return tearDownDB();
	});

	after(function(){
		return closeServer();
	});

	describe('GET endpoint', function(){
		it('Should retrieve all userprofile objects', function(){
			const token = generateToken();

			let res;
			return chai
				.request(app)
				.get('/userprofile')
				.set('authorization', `Bearer ${token}`)
				.then(function(_res){
					res = _res;
					res.should.have.status(200);
					res.body.userprofile.should.have.length.of.at.least(1);
					return Userprofile.count();
				})
				.then(function(count){
					res.body.userprofile.should.have.lengthOf(count);
				});
		});

		it('Should retrieve userprofile objects with right fields', function(){
			const token = generateToken();
			let resUserProfile;
			return chai
				.request(app)
				.get('/userprofile')
				.set('authorization', `Bearer ${token}`)
				.then(function(res){
					res.should.have.status(200);
					res.should.be.json;
					res.body.userprofile.should.be.a('array');
					res.body.userprofile.should.have.length.of.at.least(1);
					res.body.userprofile.forEach(function(userprofile){
						userprofile.should.be.a('object');
						userprofile.should.include.keys('id', 'username', 'name', 'artwork', 'animations');
						userprofile.username.should.be.a('string');
						userprofile.name.should.be.a('string');
						userprofile.artwork.should.be.a('array');
						userprofile.animations.should.be.a('array');
						userprofile.artwork[0].should.be.a('string');
						userprofile.animations[0].should.be.a('string');
					});
					resUserProfile = res.body.userprofile[0];

					return Userprofile.findById(resUserProfile.id);
				})
				.then(function(userprofile){
					resUserProfile.username.should.equal(userprofile.username);	
					resUserProfile.name.should.equal(userprofile.name);		
					resUserProfile.artwork[0].should.equal(userprofile.artwork[0]);		
					resUserProfile.animations[0].should.equal(userprofile.animations[0]);			
				});
		});
	});

	describe('POST endpoint', function(){
		
		it('Should add a new userprofile', function(){
			const token = generateToken();
			const newUserProfile = generateUserProfileData();
			console.log("proffy "+ JSON.stringify(newUserProfile));
			return chai.request(app)
				.post('/userprofile')
				.set('authorization', `Bearer ${token}`)
				.send(newUserProfile)
				.then(function(res) {
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys(
						'id', 'username', 'name', 'artwork', 'animations');
					res.body.username.should.equal(newUserProfile.username);
					res.body.name.should.equal(newUserProfile.name);
					res.body.artwork[0].should.equal(newUserProfile.artwork[0]);
					res.body.animations[0].should.equal(newUserProfile.animations[0]);
					return Userprofile.findById(res.body.id);
				})
				.then(function(userprofile) {
					userprofile.username.should.equal(newUserProfile.username);	
					userprofile.name.should.equal(newUserProfile.name);		
					userprofile.artwork[0].should.equal(newUserProfile.artwork[0]);		
					userprofile.animations[0].should.equal(newUserProfile.animations[0]);			
				});
		});
	});

	
	describe('PUT endpoint', function(){
		const token = generateToken();
		let resUserProfile;

		it('should update fields with new data', function(){
			const update = generateUserProfileData();
			return Userprofile
				.findOne()
				.then(function(userprofile){
					update.id = userprofile.id;
					return chai
						.request(app)
						.put(`/userprofile/${userprofile.id}`)
						.set('authorization', `Bearer ${token}`)
						.send(update);

				})
				.then(function(res) {
					res.should.have.status(204);
					return Userprofile.findById(update.id);
				})
				.then(function(userprofile){
					userprofile.username.should.equal(update.username);
					userprofile.name.should.equal(update.name);
					userprofile.artwork[0].should.equal(update.artwork[0]);
					userprofile.animations[0].should.equal(update.animations[0]);
		});
	});


	describe('DELETE endpoint', function(){
		const token = generateToken();

		it('should delete userprofile by id', function(){
			let userprofile;

			return Userprofile
				.findOne()
				.then(function(_animation){
					userprofile = _animation;
					return chai
					.request(app)
					.delete(`/userprofile/${userprofile.id}`)
					.set('authorization', `Bearer ${token}`);

				})
				.then(function(res){
					res.should.have.status(204);
					return Userprofile.findById(userprofile.id);
				})
				.then(function(_animation){
					should.not.exist(_animation);
				})
			})
		});
	})
})
