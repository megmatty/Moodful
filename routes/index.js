const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();



//GET /
router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});

//GET /register
router.get('/register', (req, res) => {
    res.render('register', { });
});

//POST /register
router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username, firstName: req.body.firstName }), req.body.password, (err, account) => {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/dashboard');
            });
        });
    });
});


//GET /login
router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/dashboard');
    });
});

//GET /logout
router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/ping', (req, res) => {
    res.status(200).send("pong!");
});

//GET /log
router.get('/log', (req, res) => {
    res.render('log', {user : req.user });
});

//GET /addEntry
router.get('/addEntry', (req, res) => {
    res.render('addEntry', {user : req.user });
});

//GET /log/:date
router.get('/log/:date', (req, res) => {
    Account 
      .find({_id : req.user.id},{entries: {$elemMatch: {date: Number(req.params.date)}}})
      .exec() 
      .then(user => {
        //need a way to render only this one entry
        // res.render('log', {user : req.user, entries: user[0].entries[0] });
        res.send('placeholder for ' + user[0].entries[0].date);
      }) 
      .catch(err => { console.error(err); 
    res.status(500).redirect('/log'); });
});

//GET /editEntry
router.get('/edit/:date', (req, res) => {
    Account 
      .find({_id : req.user.id},{entries: {$elemMatch: {date: Number(req.params.date)}}})
      .exec() 
      .then(user => {
        res.render('edit', {user : req.user, entries: user[0].entries[0] });
      }) 
      .catch(err => { console.error(err); 
    res.status(500).redirect('/log'); });
});


//GET /dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard', {user : req.user });
});

//POST /addEntry
router.post('/addEntry', (req, res) => {
    Account 
      .findById(req.user.id)
      .exec() 
      .then(user => { 
        user.entries.push({
            'date': Date.now(),
            'mood': req.body.mood,
            'activity': req.body.activity,
            'journal': req.body.journal
        });
        user.save();
        console.log(req.body.entry);
        console.log(req.user);
        res.redirect('/log');
      }) 
      .catch(err => { console.error(err); 
    res.status(500).redirect('/log'); });
});

// POST /edit/:date
router.post('/edit/:date', (req, res) => {
    Account
      .findById(req.user.id)
      .update(
          {entries: {$elemMatch: {date: Number(req.params.date)}}},
          {$set: {'entries.$.mood': req.body.mood, 
            'entries.$.activity': req.body.activity,
            'entries.$.journal': req.body.journal}}
      )
      .exec() 
      .then( (user) => {
        res.redirect('/log');
      }) 
      .catch(err => { console.error(err); 
    res.status(500).redirect('/log'); });
});

//this works in mongo - edit
//.findAndModify({query:{_id : ObjectId("58ffb0859a8b7a07fb5d0f20"), entries : {$elemMatch: {date: 1493151887377}}}, update: {$set: {"entries.$.mood": "PLEASE WORK"}}})
//works in mongo - delete
//.update({_id : ObjectId("58ffb0859a8b7a07fb5d0f20"), entries : {$elemMatch: {date: 1493151887377}}},{$pull: {entries:{date:1493151887377 } }} )

//GET /delete/:date
  //use warning box modal w/jquery
router.get('/delete/:date', (req, res) => {
    Account
      .findById(req.user.id)
      .update(
          {entries: {$elemMatch: {date: Number(req.params.date)}}},
          { $pull: {entries:{date: Number(req.params.date)} }}
      )
      .exec() 
      .then(user => {
        res.redirect('/log');
      }) 
      .catch(err => { console.error(err); 
    res.status(500).redirect('/log'); });
});






module.exports = router;
