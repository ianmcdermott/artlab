'use strict'
const chai = require('chai');
chai.use(require('chai-datetime'));
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const {JWT_SECRET} = require('../config');

const {app, runServer, closeServer} = require('../server');

//const expect = chai.expect;
const should = chai.should();

const {Animations} = require('../animations/models');
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

    return mongoose.connection.dropDatabase();

}

function seedAnimationData(){
	console.info('Seeding database');
	const seedData = [];
	for(let i=1; i<= 10; i++){
		seedData.push({
			title: faker.name.firstName(),
		    lastDrawnDate: faker.date.past(),
  			lastFrame: [{
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
		    frameCount: faker.random.number(100)
		});
	}
	return Animations.insertMany(seedData);
}

describe('Animations API resource', function(){

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
		it('Should retrieve all animation objects', function(){
			const token = generateToken();
			let res;
			return chai
				.request(app)
				.get('/animations')
				.set('authorization', `Bearer ${token}`)
				.then(function(_res) {
					res = _res;
					console.log('Res body is '+ res.body);
					res.should.have.status(200);
					res.body.animations.should.have.length.of.at.least(1);
					return Animations.count();
				})
				.then(function(count){
					res.body.animations.should.have.lengthOf(count);
				});
		});

		it('Should retrieve animations objects with right fields', function(){
			let resAnimation;
			const token = generateToken();

			return chai
				.request(app)
				.get('/animations')
				.set('authorization', `Bearer ${token}`)
				.then(function(res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.animations.should.be.a('array');
					res.body.animations.should.have.length.of.at.least(1);
					res.body.animations.forEach(function(post){
						post.should.a('object');
						post.should.include.keys('id', 'title', 'lastDrawnDate', 'lastFrame', 'frameCount');
					});
					resAnimation = res.body.animations[0];
					return Animations.findById(resAnimation.id);
				})
				.then(function(animation) {
					resAnimation.title.should.equal(animation.title);
				//	resAnimation.lastDrawnDate.should.equalDate(animation.lastDrawnDate);
				//	resAnimation.lastFrame.should.equal(animation.lastFrame);
					resAnimation.frameCount.should.equal(animation.frameCount);
				});
		});
	});

	describe('POST endpoint', function(){
		it('Should add a new animation', function(){
			const token = generateToken();

			const newAnimation = {
				title: faker.name.firstName(),
			    lastDrawnDate: faker.date.past(),
	  			lastFrame: [{
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
			    frameCount: faker.random.number(100)
			}

			return chai.request(app)
				.post('/animations')
				.set('authorization', `Bearer ${token}`)
				.send(newAnimation)
				.then(function(res) {
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys(
						'id', 'title', 'lastDrawnDate', 'lastFrame', 'frameCount');
					res.body.title.should.equal(newAnimation.title);
				//	res.body.lastDrawnDate.should.equalDate(newAnimation.lastDrawnDate);
					//res.body.lastFrame.should.equal(newAnimation.lastFrame);
					res.body.frameCount.should.equal(newAnimation.frameCount);

					res.body.id.should.not.be.null;
					return Animations.findById(res.body.id);
				})
				.then(function(animation) {
					animation.title.should.equal(newAnimation.title);
				//	animation.lastDrawnDate.should.equalDate(newAnimate.lastDrawnDate);
					//animation.lastFrame.should.equal(newAnimation.lastFrame);
					animation.frameCount.should.equal(newAnimation.frameCount);
				});
		});
	});

	describe('PUT endpoint', function(){
		it('should update fields with new data', function(){
			const update = {
				title: faker.name.firstName(),
			    lastDrawnDate: faker.date.past(),
	  			lastFrame: [{
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
			    frameCount: faker.random.number(100)
			};

			const token = generateToken();

			return Animations
				.findOne()
				.then(function(animation) {
					update.id = animation.id;
					//post the fake data
					return chai
						.request(app)
						.put(`/animations/${animation.id}`)
						.set('authorization', `Bearer ${token}`)
						.send(update);
				})
				.then(function(res){
					res.should.have.status(204);
					return Animations.findById(update.id);
				})
				.then(function(animation){
					animation.title.should.equal(update.title);
					animation.lastDrawnDate.should.equalDate(update.lastDrawnDate);
				//	animation.lastFrame.should.equal(update.lastFrame);
					animation.frameCount.should.equal(update.frameCount);

				});
		});
	});

	describe('DELETE endpoint', function(){
		it('should delete animation by id', function(){
			let animation;
			const token = generateToken();

			return Animations
				.findOne()
				.then(function(_animation){
					animation = _animation;
					return chai
					.request(app)
					.delete(`/animations/${animation.id}`)
					.set('authorization', `Bearer ${token}`);

				})
				.then(function(res){
					res.should.have.status(204);
					return Animations.findById(animation.id);
				})
				.then(function(_animation) {
					should.not.exist(_animation);
				})
		})
	});
})