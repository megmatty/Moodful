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

describe('Tests', function() {
  	this.timeout(15000);

	before(function() {
		return runServer(TEST_DATABASE_URL); 
	});

	after(function() {
		tearDownDb();
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
	describe('add an entry', () => {
		it('should add a entry', () => {
			return authUser
				.post('/login')
				.send({username: 'email@email.com', password: 'test' })
				.expect(302)
				.expect('Location', '/dashboard')
				.then(res => {
					return authUser
						.post('/addEntry')
						.send({ mood: 'happy', activity: [ 'art', 'games' ], journal: 'sup' })
						.expect(302)
						.expect('Location', '/log');
				})
				.then(res => {
					return Account
						.findOne({username: 'email@email.com'})
						.exec()
						.then(user => {
							console.log(user.entries[0].mood)
							describe('user exist', () => {
								it('user should have mood', () => {

									user.entries[0].mood.should.not.have.length(5);
								})
							})
						})
				})
				.catch(err => {
					if (err) console.log('Something went wrong: ' + err)
				});
		});
	});
	describe('edit a entry', () => {
		it('should edit a log', () => {
			let editUrl;
			let reqBody = { 
					mood: 'amused',
				  	activity: [ 'art', 'games', 'read' ],
				        journal: 'post this? ' 
			}
			return authUser
				.post('/login')
				.send({username: 'email@email.com', password: 'test' })
				.expect(302)
				.expect('Location', '/dashboard')
				.then((res, err) => {
					return Account
						.findOne({username: 'email@email.com'})
						.exec()
						.then(user => {
							console.log('in edit') 
							date = user.entries[0].date; 
							editUrl = '/edit/'+date;
							console.log(editUrl); 
							
						})
						.catch(err => {
							if (err) {
								console.log('Something went wrong' + err)
							}
						});
				})
				.then(res => {
					return authUser
						.post(editUrl)//'/edit/:date'
						.send(reqBody)
						.expect(302)
						.expect('Location', '/log');
				})
				.then(res => {

					return Account
						.findOne({username: 'email@email.com'})

						.exec()
						.then(user => {
							describe('check edit', () => {
								it('mood should equal value', () => {
	
									user.entries[0].mood.should.eql('amusedd');
								})
							})


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
		describe('delete a entry', () => {
			it('should remove a log', () => {

			let deleteUrl;
			return authUser
				.post('/login')
				.send({username: 'email@email.com', password: 'test' })
				.expect(302)
				.expect('Location', '/dashboard')
				.then((res, err) => {
					return Account
						.findOne({username: 'email@email.com'})
						.exec()
						.then(user => {
							console.log('in delete') 
							date = user.entries[0].date; 
							deleteUrl = '/delete/'+date;
							console.log(deleteUrl); 
							
						})
						.catch(err => {
							if (err) {
								console.log('Something went wrong' + err)
							}
						});
				})
				.then(res => {
					return authUser
						.get(deleteUrl)//'/edit/:date'
						//.send(reqBody)
						.expect(302)
						.expect('Location', '/log');
				})
				.then(res => {

					return Account
						.findOne({username: 'email@email.com'})

						.exec()
						.then(user => {
							describe('check delete', () => {
								it('mood should equal value', () => {
	
									console.log(user);
									console.log('2')
									
									console.log(user.entries.length);
									user.entries.length.should.equal(2)
								
								
								})
							})


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
	});
});


