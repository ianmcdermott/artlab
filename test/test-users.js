// global.DATABASE_URL = config.DATABASE_URL;
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const {JWT_SECRET} = require('../config');
const {TEST_DATABASE_URL} = require('../config');

global.DATABASE_URL = TEST_DATABASE_URL;

const expect = chai.expect;

chai.use(chaiHttp);

function tearDownDB(){
	return mongoose.connection.dropDatabase()
}

describe('/api/users', function(){
	const username = 'exampleUser';
	const password = 'examplePass';
	const firstName = 'First';
	const lastName = 'Last';
	const usernameB = 'exampleUserB';
	const passwordB = 'examplePassB';
	const firstNameB = 'FirstB';
	const lastNameB = 'LastB'; 

	before(function() {
	 	return runServer(TEST_DATABASE_URL);
	});


	afterEach(function() {
		return tearDownDB();
	});

	after(function() {
	    return closeServer();
	});

	describe('/api/users', function(){
		describe('POST', function(){
			it('Should reject users with missing username', function(){
				return chai
					.request(app)
					.post('/api/users')
					.send({
						password,
						firstName,
						lastName
					})
					.then(()=>
						expect.fail(null, null, 'Request should not succeed')
					)
					.catch(err =>{
						//if the error caught is a chai assertion error, throw it
						if(err instanceof chai.AssertionError){
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Missing Field');
						expect(res.body.location).to.equal('username');
					});
			});

			it('Should reject users with missing password', function(){
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username,
						firstName,
						lastName
					})
					.then(()=>
						expect.fail(null, null, 'request should not succeed')
					)
					.catch(err => {
						if(err instanceof chai.AssertionError){
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Missing Field');
						expect(res.body.location).to.equal('password');
					})

			});

			it('Should reject users with non-string username', function(){
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username: 1,
						password,
						firstName,
						lastName
					})
					.then(()=>{
						expect.fail(null, null, 'request should not succeed')
					})
					.catch(err =>{
						if(err instanceof chai.AssertionError){
							throw err;
						}
						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Incorrect field type: expected string');
						expect(res.body.location).to.equal('username');
					})
			});

			it('Should reject users with non-string password', function(){
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username,
						password: 1,
						firstName,
						lastName
					})
					.then(() =>{
						expect.fail(null, null, 'request should not succeed');
					})
					.catch(err =>{
						if(err instanceof chai.AssertionError){
							throw err;
						}
						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Incorrect field type: expected string');
						expect(res.body.location).to.equal('password');
					})
			});

			it('Should reject users with non-string first name', function(){
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username,
						password,
						firstName: 1,
						lastName
					})
					.then(() =>{
						expect.fail(null, null, 'request should not succeed');
					})
					.catch(err => {
						if(err instanceof chai.AssertionError){
							throw err;
					}
					const res = err.response;
					expect(res).to.have.status(422);
					expect(res.body.reason).to.equal('ValidationError');
					expect(res.body.message).to.equal('Incorrect field type: expected string');
					expect(res.body.location).to.equal('firstName');
				})

			});

			it('Should reject users with non-string last name', function(){
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username,
						password,
						firstName,
						lastName: 1
					})
					.then(()=>{
						expect.fail(null, null, 'request should not succeed');
					})
					.catch(err => {
						if(err instanceof chai.AssertionError){
							throw err;
					}
					const res = err.response;
					expect(res).to.have.status(422);
					expect(res.body.reason).to.equal('ValidationError');
					expect(res.body.message).to.equal('Incorrect field type: expected string');
					expect(res.body.location).to.equal('lastName');
				})
			});

			it('Should reject users with trimmable username', function(){
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username: ` ${username} `,
						password,
						firstName,
						lastName
					})
					.then(()=>{
						expect.fail(null, null, 'request should not succeed');
					})
					.catch(err => {
						if(err instanceof chai.AssertionError){
							throw err;
					}
					const res = err.response;
					expect(res).to.have.status(422);
					expect(res.body.reason).to.equal('ValidationError');
					expect(res.body.message).to.equal('Cannot start or end with whitespace');
					expect(res.body.location).to.equal('username');
				})
			});

			it('Should reject users with trimmable password', function(){
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username,
						password: ` ${password} `,
						firstName,
						lastName
					})
					.then(() =>{
						expect.fail(null, null, 'Request should not succeed');
					})
					.catch(err =>{
						if(err instanceof chai.AssertionError){
							throw err;
						}
						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Cannot start or end with whitespace');
						expect(res.body.location).to.equal('password');
					})
			});

			it('Should reject users with empty username', function(){
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username: '',
						password,
						firstName,
						lastName
					})
					.then(() =>{
						expect.fail(null, null, 'Request should not succeed');
					})
					.catch(err =>{
						if(err instanceof chai.AssertionError){
							throw err;
						}
						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Must be at least 1 characters long');
						expect(res.body.location).to.equal('username');
					})

			});


			it('Should reject user with duplicate username', function(){
				return chai
					return User.create({
						username,
						password,
						firstName,
						lastName
					})
					.then(()=>{
						chai
						.request(app)
						.post('/api/users')
						.send({
							username,
							password: '',
							firstName,
							lastName
						})
					})
					.then(()=>{
						expect.fail(null, null, 'Request should not succeed');
					})
					.cath(err =>{
						if(err instanceof chai.AssertionError){
							throw err;
						}
						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Username taken');
						expect(res.body.location).to.equal('username');
					})


			});

			it('Should reject users with password less than 10 char', function(){
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username,
						password: '123456789',
						firstName,
						lastName
					})
					.then(() => {
						expect.fail(null, null, 'Request should not succeed');
					})
					.catch(err =>{
						if(err instanceof chai.AssertionError){
							throw err;
						}
						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Must be at least 10 characters long');
						expect(res.body.location).to.equal('password');
					})

			});

			it('Should reject users with password more than 72 char', function(){
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username,
						password: new Array(73).fill('a').join(''),
						firstName,
						lastName
					})
					.then(()=>{
						expect.fail(null, null, 'Request should not succeed');
					})
					.catch(err =>{
						if(err instanceof chai.AssertionError){
							throw err;
						}
						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Must be at most 72 characters long');
						expect(res.body.location).to.equal('password');
					})
			});

			it('Should create a new user', function(){
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username,
						password,
						firstName,
						lastName
					})
					.then(res => {
						expect(res).to.have.status(201);
						expect(res.body).to.be.an('object');
						expect(res.body).to.have.keys(
							'username',
							'firstName',
							'lastName'
						);
						expect(res.body.username).to.equal(username);
						expect(res.body.firstName).to.equal(firstName);
						expect(res.body.lastName).to.equal(lastName);
						return User.findOne({
							username
						});
					})
					.then(user => {
						expect(user).to.not.be.null;
						expect(user.firstName).to.equal(firstName);
						expect(user.lastName).to.equal(lastName);
						return user.validatePassword(password);
					})
					.then(passwordIsCorrect =>{
						expect(passwordIsCorrect).to.be.true;
					});
			});

			it('Should trim first/last names', function(){
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username,
						password,
						firstName: ` ${firstName} `,
						lastName: ` ${lastName} `
					})
					.then(res => {
						expect(res).to.have.status(201);
						expect(res.body).to.be.an('object');
						expect(res.body).to.have.keys(
							'username',
							'firstName',
							'lastName'
						);
						expect(res.body.username).to.equal(username);
						expect(res.body.firstName).to.equal(firstName);
						expect(res.body.lastName).to.equal(lastName);
						return User.findOne({
							username
						});
					})
					.then(user => {
						expect(user).to.not.be.null;
						expect(user.firstName).to.equal(firstName);
						expect(user.lastName).to.equal(lastName);
					});
			});
		});
		describe('GET', function(){
			it('Should return an empty array initially', function(){
				return chai
					.request(app)
					.get('/api/users').then(res =>{
						expect(res).to.have.status(200);
						expect(res.body).to.be.an('array');
						expect(res.body).to.have.length(0);
					})
			})
			it('Should return an array of users', function(){
				return User.create(
					{	
						username,
						password,
						firstName,
						lastName
					},
					{	
						username: usernameB,
						password: passwordB,
						firstName: firstNameB,
						lastName: lastNameB
					}
				)
				.then(() => chai.request(app).get('/api/users'))
				.then(res => {
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('array');
					expect(res.body).to.have.length(2);
					expect(res.body[0]).to.deep.equal({
						username,
						firstName,
						lastName
					});
					expect(res.body[1]).to.deep.equal({
						username: usernameB,
						firstName: firstNameB,
						lastName: lastNameB
					});
				});
			});
		});
	});
});