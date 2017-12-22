const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');

//const expect = chai.expect;
const should = chai.should();

const {UserDrawn} = require('../userdrawn/models');
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

function tearDownDB(){
	return new Promise(function(resolve, reject){
		console.warn('Deleting database');
		mongoose.connection.dropDatabase()
			.then(function(result){resolve(result)})
			.catch(function(err){reject(err)})
	});
}

function seedAnimationData(){
	console.info('Seeding database');
	const seedData = [];

	for(let i=1; i<= 10; i++){
		seedData.push({
			id: faker.random.alphaNumeric(24),
			frameNumber: faker.random.number(100),
  			frame: [{
  				color: faker.internet.color(),
		        lines: [{
		          mouseX: faker.random.number(1000), 
		          mouseY: faker.random.number(1000), 
		          pmouseX: faker.random.number(1000), 
		          pmouseY: faker.random.number(1000)
		        }],
		        points: [{
		          x: faker.random.number(1000),
		          y: faker.random.number(1000)
		        }],
		        radius: faker.random.number(100)
		    }],
			title: faker.company.bsNoun(),
			animationId: faker.random.alphaNumeric(24),
			artist: faker.company.bsNoun(),
		    creationDate: faker.date.recent(),
		    userId: "5a399a76734d1d2f59553d15"
		});
	}
	return UserDrawn.insertMany(seedData);
}

describe('Userdrawn API resource', function(){

	before(function(){
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function(){
		return seedAnimationData();
	});

	afterEach(function(){
		return tearDownDB();
	});

	after(function(){
		return closeServer();
	});

	describe('GET endpoint', function(){
		it('Should retrieve all userdrawn objects', function(){
			const token = generateToken();

			let res;
			return chai
				.request(app)
				.get('/userdrawn')
				.set('authorization', `Bearer ${token}`)
				.then(function(_res){
					res = _res;
					res.should.have.status(200);
					res.body.userdrawn.should.have.length.of.at.least(1);
					return UserDrawn.count();
				})
				.then(function(count){
					res.body.userdrawn.should.have.lengthOf(count);
				});
		});

		it('Should retrieve userdrawn objects with right fields', function(){
			const token = generateToken();
			let resUserdrawn;
			return chai
				.request(app)
				.get('/userdrawn')
				.set('authorization', `Bearer ${token}`)
				.then(function(res){
					res.should.have.status(200);
					res.should.be.json;
					res.body.userdrawn.should.be.a('array');
					res.body.userdrawn.should.have.length.of.at.least(1);
					res.body.userdrawn.forEach(function(userdrawn){
						userdrawn.should.a('object');
						userdrawn.should.include.keys('id', 'frameNumber', 'frame', 'title', 'animationId', 'artist', 'creationDate', 'userId');
						userdrawn.frameNumber.should.be.a('number');
						userdrawn.frame.should.be.a('array');
						userdrawn.title.should.be.a('string');
						userdrawn.animationId.should.be.a('string');
						userdrawn.artist.should.be.a('string');
						userdrawn.creationDate.should.be.a('string');
						userdrawn.userId.should.be.a('string');

					});
					resUserdrawn = res.body.userdrawn[0];

					return UserDrawn.findById(resUserdrawn.id);
				})
				.then(function(userdrawn){
					resUserdrawn.frameNumber.should.equal(userdrawn.frameNumber);	
				//	resUserdrawn.frame.should.equal(userdrawn.frame);		
					resUserdrawn.title.should.equal(userdrawn.title);		
					resUserdrawn.animationId.should.equal(userdrawn.animationId);		
					resUserdrawn.artist.should.equal(userdrawn.artist);		
				//	resUserdrawn.creationDate.should.equal(userdrawn.creationDate);		
				//	resUserdrawn.userId.should.equal(userdrawn.userId);		
				});
		});
	});

	describe('POST endpoint', function(){
		
		it('Should add a new userdrawn', function(){
			const token = generateToken();

			const newUserdrawn = {
				id: faker.random.alphaNumeric(24),
				frameNumber: faker.random.number(100),
	  			frame: [{
	  				color: faker.internet.color(),
			        lines: [{
			          mouseX: faker.random.number(1000), 
			          mouseY: faker.random.number(1000), 
			          pmouseX: faker.random.number(1000), 
			          pmouseY: faker.random.number(1000)
			        }],
			        points: [{
			          x: faker.random.number(1000),
			          y: faker.random.number(1000)
			        }],
			        radius: faker.random.number(100)
			    }],
				title: faker.company.bsNoun(),
				animationId: faker.random.alphaNumeric(24),
				artist: faker.company.bsNoun(),
			    creationDate: faker.date.recent(),
			    userId: faker.random.alphaNumeric(24)
			}

			return chai.request(app)
				.post('/userdrawn')
				.set('authorization', `Bearer ${token}`)
				.send(newUserdrawn)
				.then(function(res) {
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys(
						'id', 'frameNumber', 'frame', 'title', 'animationId', 'artist', 'creationDate', 'userId');
					res.body.id.should.equal(newUserdrawn.id);
					res.body.frameNumber.should.equal(newUserdrawn.frameNumber);
					res.body.frame.should.equal(newUserdrawn.frame);
					res.body.title.should.equal(newUserdrawn.title);
					res.body.animationId.should.equal(newUserdrawn.animationId);
					res.body.artist.should.equal(newUserdrawn.artist);
					res.body.creationDate.should.equal(newUserdrawn.creationDate);
					res.body.userId.should.equal(newUserdrawn.userId);
					res.body.id.should.not.be.null;
					return UserDrawn.findById(res.body.id);
				})
				.then(function(userdrawn) {
					resUserdrawn.frameNumber.should.equal(userdrawn.frameNumber);	
					resUserdrawn.frame.should.equal(userdrawn.frame);		
					resUserdrawn.title.should.equal(userdrawn.title);		
					resUserdrawn.animationId.should.equal(userdrawn.animationId);		
					resUserdrawn.artist.should.equal(userdrawn.artist);		
					resUserdrawn.creationDate.should.equal(userdrawn.creationDate);		
					resUserdrawn.userId.should.equal(userdrawn.userId);		
				});
		});
	});

	describe('PUT endpoint', function(){
		const token = generateToken();

		it('should update fields with new data', function(){

			const update = {
				id: faker.random.alphaNumeric(24),
				frameNumber: faker.random.number(100),
	  			frame: [{
	  				color: faker.internet.color(),
			        lines: [{
			          mouseX: faker.random.number(1000), 
			          mouseY: faker.random.number(1000), 
			          pmouseX: faker.random.number(1000), 
			          pmouseY: faker.random.number(1000)
			        }],
			        points: [{
			          x: faker.random.number(1000),
			          y: faker.random.number(1000)
			        }],
			        radius: faker.random.number(100)
			    }],
				title: faker.company.bsNoun(),
				animationId: faker.random.alphaNumeric(24),
				artist: faker.company.bsNoun(),
			    creationDate: faker.date.recent(),
			    userId: faker.random.alphaNumeric(24)
			}

			return UserDrawn
				.findOne()
				.then(function(userdrawn){
					update.id = userdrawn.id;
					//post the fake data
					return chai
						.request(app)
						.put(`/userdrawn/${userdrawn.id}`)
						.set('authorization', `Bearer ${token}`)
						.send(update);
				})
				.then(function(res) {
					res.should.have.status(204);
					return UserDrawn.findById(update.id);
				})
				.then(function(userdrawn){
					resUserdrawn.frameNumber.should.equal(userdrawn.frameNumber);	
					resUserdrawn.frame.should.equal(userdrawn.frame);		
					resUserdrawn.title.should.equal(userdrawn.title);		
					resUserdrawn.animationId.should.equal(userdrawn.animationId);		
					resUserdrawn.artist.should.equal(userdrawn.artist);		
					resUserdrawn.creationDate.should.equal(userdrawn.creationDate);		
					resUserdrawn.userId.should.equal(userdrawn.userId);		
		});
	});

	describe('DELETE endpoint', function(){
		const token = generateToken();

		it('should delete userdrawn by id', function(){
			let userdrawn;

			return UserDrawn
				.findOne()
				.then(function(_animation){
					userdrawn = _animation;
					return chai
					.request(app)
					.delete(`/userdrawn/${userdrawn.id}`)
					.set('authorization', `Bearer ${token}`);

				})
				.then(function(res){
					res.should.have.status(204);
					return UserDrawn.findById(userdrawn.id);
				})
				.then(function(_animation){
					should.not.exist(_animation);
				})
			})
		});
	})
})
