const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// // this makes the should syntax available throughout
// // this module
const should = chai.should();

const {Account} = require('../models/account');
const {app, runServer, closeServer} = require('../app');
const {TEST_DATABASE_URL} = require('../config');
const request = require('supertest');
const api = request(app);
const authUser = request.agent(app);

chai.use(chaiHttp);

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  ata from one test does not stick
// around for next one
const tearDownDb = () => {
 console.warn('Deleting database');
 return mongoose.connection.dropDatabase();
}

describe('Draft Tracker API resource', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL); 
	});

	after(function() {
		//tearDownDb();
		return closeServer();
	});

	describe('testing user authentication', () => {
		it('should create a user', () => {
			return api
				.post('/register')
				.send({username:'email@email.com', firstName: 'test@test.com', password: 'test'})
				.expect(302)
				.expect('Location', '/dashboard');
		});
	});

	describe('login a user', () => {
		it('should login a user', () => {
			return api
				.post('/login')
				.send({username: 'email@email.com', password: 'test'})
				.expect(302)
				.expect('Location', '/dashboard');
		});
	});
/*
	describe('add a draft', () => {
		it('should add a draft to logged in user', () => {
			return authUser
				.post('/login')
				.send({ email: 'test@test.com', password: 'test' })
				.expect(302)
				.expect('Location', '/dashboard')
				.then(res => {
					return authUser
						.post('/user/add/draft')
						.send({
							date: '2017-04-15T01:16:38.170Z',
							sets: 'KLD',
							format: 'Swiss League',
							colorsPlayed: 'White Blue',
							matches: [{
								matchName: 'match1',
								gamesWon: 2,
								gamesLost: 0
								},{
								matchName: 'match2',
								gamesWon: 0,
								gamesLost: 2
								},{
								matchName: 'match3',
								gamesWon: 2,
								gamesLost: 1
								}]
						})
						.expect(302)
						.expect('Location', '/dashboard');
				})
				.then(res => {
					return User
						.findOne({username: 'test@test.com'})
						.exec()
						.then(user => {
							user.drafts.should.have.length(1);
						})
				})
				.catch(err => {
					if (err) console.log('Something went wrong: ' + err)
				});
		});
	});

	describe('get a draft by id', () => {
		it('should get 200 response', () => {
			let draftEditId;
			return authUser
				.post('/login')
				.send({ email: 'test@test.com', password: 'test' })
				.expect(302)
				.expect('Location', '/dashboard')
				.then(res => {		
					return User
						.findOne({username: 'test@test.com'})
						.exec()
						.then(user => {
							draftEditId = user.drafts[0].id;
						})
						.catch(err => {
							if (err) {
								console.log('Something went wrong' + err)
							}
						});
				})
				.then(res => {
					return authUser
						.get('/edit/' + draftEditId)
						.expect(200)
				})
				.catch(err => {
					if (err) console.log('Something went wrong: ' + err);
				});
		});
	});

	describe('edit a draft', () => {
		it('should edit an existing draft record', () => {
			let draftEditId;
			let draftBody= {							
							date: '2017-04-15T01:16:38.170Z',
							sets: 'EDITED',
							format: 'Swiss League',
							colorsPlayed: 'White Blue',
							matches: [{
								matchName: 'match1',
								gamesWon: 2,
								gamesLost: 0
								},{
								matchName: 'match2',
								gamesWon: 0,
								gamesLost: 2
								},{
								matchName: 'match3',
								gamesWon: 2,
								gamesLost: 1
								}]
					};

			return authUser
				.post('/login')
				.send({ email: 'test@test.com', password: 'test' })
				.expect(302)
				.expect('Location', '/dashboard')
				.then((res, err) => {
					return User
						.findOne({username: 'test@test.com'})
						.exec()
						.then(user => {
							draftEditId = user.drafts[0].id;
							draftBody.draftId = draftEditId;
						})
						.catch(err => {
							if (err) {
								console.log('Something went wrong' + err)
							}
						});
				})
				.then(res => {
					return authUser
						.post('/user/edit/update')
						.send(draftBody)
						.expect(302)
						.expect('Location', '/dashboard');
				})
				.then(res => {
					return User
						.findOne({username: 'test@test.com'})
						.exec()
						.then(user => {
							user.drafts[0].sets.should.eql('EDITED');
						})
						.catch(err => {
							if (err) console.log('Something went wrong: ' + err);
						});
				})				
				.catch(err => {
					if (err) {
						console.log('Something went wrong: ' + err);
					}
				});
		});
	});

	describe('Delete Endpoint', () => {
		it('should delete draft and redirect to dashboard', () => {
			let draftDeleteId;
			return authUser
				.post('/login')
				.send({ email: 'test@test.com', password: 'test' })
				.expect(302)
				.expect('Location', '/dashboard')
				.then(res => {		
					return User
						.findOne({username: 'test@test.com'})
						.exec()
						.then(user => {
							draftDeleteId = user.drafts[0].id;
						})
						.catch(err => {
							if (err) {
								console.log('Something went wrong' + err)
							}
						});
				})
				.then(res => {
					return authUser
						.post('/user/draft/delete')
						.send({draftId: draftDeleteId})
						.expect(302)
						.expect('Location', '/dashboard')
				})
				.then(res => {
					return User
						.findOne({username: 'test@test.com'})
						.exec()
						.then(user => {
							user.drafts.should.be.empty;
						})
						.catch(err => {
							if (err) console.log('Something went wrong: ' + err);
						});
				})
				.catch(err => {
					if (err) console.log('Something went wrong: ' + err);
				});

		});
	});
	*/
});
