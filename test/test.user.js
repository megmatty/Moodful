/*const should = require("should");
const mongoose = require('mongoose');
const Account = require("../models/account.js");

describe('Account access', () => {

    before((done) => {
        const db = mongoose.connect('mongodb://localhost/test');
        done();
    });

    after((done) => {
        // Account.remove({}, () => {
        //     done();
        // });
        mongoose.connection.close();
        done();
    });

    beforeEach( (done) => {
        var account = new Account({
            username: '12345',
            password: 'testy'
        });

        account.save((error) => {
            if (error) console.log('error' + error.message);
            else console.log('no error');
            done();
        });
    });

    it('Find a user by username', (done) => {
        Account.findOne({ username: '12345' }, (err, account) => {
            account.username.should.eql('12345');
            console.log("   username: ", account.username);
            done();
        });
    });

    it('Adds an entry', (done) => {
       Account 
      .update({ username: '12345' })
      .exec() 
      .then(user => { 
        user.entries.push({
            'date': Date.now(),
            'mood': 'Happy',
            'activity': 'Running',
            'journal': 'Test'
        });
        user.save();
        done();
    });
});


    afterEach((done) => {
        // Account.remove({}, () => {
        //     done();
        // });
     });

});*/

