const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Entry = new Schema({
      activities: Array,
      moods: Array
});


Entry.plugin(passportLocalMongoose);

module.exports = mongoose.model('entry', Entry);
