const express = require('express');
const passport = require('passport');
const {Account} = require('../models/account');
const Entry = require('../models/entry');

const router = express.Router();
const app = express();


//GET /
router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});


//POST /register
router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username, firstName: req.body.firstName }), req.body.password, (err, account) => {
	    console.log(req.body);
	    
        if (err) {
          return res.render('index', { error : err.message });
        }
//need something to handle registration errors besides returning to '/'
        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
		console.log(req.body); 
                res.redirect('/dashboard');
            });
        });
    });
});



//POST LOGIN
router.post('/login', passport.authenticate('local'), (req, res, next) => { //, { failureRedirect: '/login', failureFlash: true }s
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
    if (!req.user) {
      res.redirect('/');
    }
    res.render('log', {user : req.user });
});

//GET /addEntry
router.get('/addEntry', (req, res) => {
    if (!req.user) {
      res.redirect('/');
    }
    console.log(req.body);
    Entry
	.findOne()
	.exec()
	.then(entry => {
    		console.log(entry);
	        res.render('addNew', {user : req.user, moods: entry.moods, activities:entry.activities});
		
   	 })
    //var moods = [	{name:'happy'},{name:'sad'},{name:'amused'} ]

	//[{name:'art'},{name:'games'},{name:'read'},{name:'nap'} ]


});

//GET /editEntry
router.get('/edit/:date', (req, res) => {
    if (!req.user) {
      res.redirect('/');
    }
    Account 
      .find({_id : req.user.id},{entries: {$elemMatch: {date: Number(req.params.date)}}})
      .exec() 
      .then(user => {

       Entry
	.findOne()
	.exec()
	.then(entry => {
	        //res.render('addNew', {user : req.user, moods: entry.moods, activities:entry.activities});
		var mood = user[0].entries[0].mood; 
		var allMoods = entry.moods; 
		//console.log(repeatMood(allMoods, mood))
		console.log(entry.activities)
		console.log('get');
		console.log(user[0].entries[0].activity)
		//console.log(req.body);

		
	        res.render('editNew', {user : req.user, entries: user[0].entries[0], moods:entry.moods, activities:entry.activities, mood:mood });
		
   	 })
		


        //res.render('editNew', {user : req.user, entries: user[0].entries[0] });
      }) 
      .catch(err => { console.error(err); 
    res.status(500).redirect('/log'); });
});


function repeatMood(allMoods, mood){
		for(var a=0; a<allMoods.length; a++){
			if(allMoods[a].name == mood){
				console.log(mood) 
				return mood; 
			}
		}	
		return null;  	
}

//Sprout pie data
//
/*	"firstName" : "a",
	"entries" : [
		{
			"date" : 1494352851099,
			"mood" : "happy",
			"activity" : [
				"art",
				"games"
			],
			"journal" : "sup"
		}
	],
*/

function moodData(req){

	console.log('in mood');
	console.log(req.body)
    var arr = [];
    //for (var i = req.user.entries.length - 1; i > req.user.entries.length - 8; i--) {
     for (var i = 0; i < req.user.entries.length; i++) {
        var key = req.user.entries[i].mood;

        console.log(key);
        for(var j = 0; j < arr.length; j++){
            var obj = arr[j]
            console.log(obj);

            if (obj.name == key) {

                console.log('repeat');
                obj['value']++;
                break;
            }
        }
        if (j == arr.length || arr.length == 0) {
            var obj = {};  
            obj['name'] = key;
            obj['value'] = 1;
            arr.push(obj)
        }
    }
    console.log(arr)
    return arr;
}


//GET /dashboard
router.get('/dashboard', (req, res) => {
    if (!req.user) {
      res.redirect('/');
      return
    }
    let arr = moodData(req)
    res.render('dashboard', {user : req.user, data : arr });
});



//GET /socialDash
router.get('/social_dashboard', (req, res) => {

    if (!req.user) {
      res.redirect('/');
      return
    }
    Entry
	.findOne()
	.exec()
	.then(entry => {
		console.log('this is it');
		console.log(entry)
	})


    let arr = moodData(req)

    res.render('socialDash', {user : req.user, data : arr });
});


//POST /addEntry
router.post('/addEntry', (req, res) => {
	console.log('body')
	console.log(req.body);

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
        res.redirect('/log');
      }) 
      .catch(err => { console.error(err); 
    res.status(500).redirect('/log'); });
});

// POST /edit/:date
router.post('/edit/:date', (req, res) => {
	console.log('post');
	console.log(req.body);

    Account
      .findById(req.user.id)
      .update(
          {entries: {$elemMatch: {date: Number(req.params.date)}}},
          {$set: {'entries.$.mood': req.body.mood, 
            'entries.$.activity': req.body.activity,
            'entries.$.journal': req.body.journal}}
      )
      .exec() 
      .then(user => {
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
    if (!req.user) {
      res.redirect('/');
    }

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






///module.exports = router;
var routes = router;
module.exports = {routes, app};
