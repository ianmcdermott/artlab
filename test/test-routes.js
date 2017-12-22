const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server.js');

const should = chai.should();
chai.use(chaiHttp);

describe('Check Routes', function(){

	it('Should return 200 status', function(){
		return chai.request(app)
			.get('/')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.html;
			})
	});
	
	it('Should return 200 status for canvas', function(){
		return chai.request(app)
			.get('/canvas.html')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.html;
			})
	});

	it('Should return 200 status for dashboard', function(){
		return chai.request(app)
			.get('/dashboard.html')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.html;
			})
	});

	it('Should return 200 status for gallery', function(){
		return chai.request(app)
			.get('/gallery.html')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.html;
			})
	});

	it('Should return 200 status for index', function(){
		return chai.request(app)
			.get('/index.html')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.html;
			})
	});

	it('Should return 200 status for login', function(){
		return chai.request(app)
			.get('/login.html')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.html;
			})
	});

	it('Should return 200 status for pick', function(){
		return chai.request(app)
			.get('/pick.html')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.html;
			})
	});

	it('Should return 200 status for register', function(){
		return chai.request(app)
			.get('/register.html')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.html;
			})
	});

	it('Should return 200 status for settings`', function(){
		return chai.request(app)
			.get('/settings.html')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.html;
			})
	});

	it('Should return 200 status for showcase`', function(){
		return chai.request(app)
			.get('/showcase.html')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.html;
			})
	});
})
