// Load required packages
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	name: {type: String, required: true},
	email: {type: String, index: {unique: true, dropDups: true, required: true}},
	pendingTasks: [String],
	dateCreated: {type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);