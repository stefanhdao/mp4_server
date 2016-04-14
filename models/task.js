// Load required packages
var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: String,
	deadline: {type: Date, required: true},
	completed: Boolean,
	assignedUser: String,
	assignedUserName: String,
	dateCreate: {type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);