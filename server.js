// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var Llama = require('./models/llama');
var User = require('./models/user');
var Task = require('./models/task')
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
//mongoose.connect('mongodb://localhost/mp4');
//mongoose.connect('mongodb://cs498:cs498@ds047865.mlab.com:47865/cs498_mp4_server')
mongoose.connect('mongodb://sdaotemp:thisisunsecure@ds023530.mlab.com:23530/mp4_cs498rk_sdao2')


// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  next();
};

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); 
});

app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));


// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello World!' });
});

//Llama route
var llamaRoute = router.route('/llamas');
var userRoute = router.route('/users');
var userSpecificRoute = router.route('/users/:user_id');
var taskRoute = router.route('/tasks');
var taskSpecificRoute = router.route('/tasks/:task_id');

llamaRoute.get(function(req, res) {
	console.log('hi')
  res.status(200).json([{ "name": "alice", "height": 12 }, { "name": "jane", "height": 13 }]);
});

//Add more routes here

//userRoute

userRoute.get(function(req, res) {

	var where = null;
	var count = null;
	var sort = null;
	var select = null;
	var skip = null;
	var limit = null;

	if(req.query.where != undefined)
	{
		where = eval("("+ req.query.where + ")");
	}

	if(req.query.count != undefined)
	{
		count = eval("("+ req.query.count + ")");
	}

	if(req.query.sort != undefined)
	{
		sort = eval("("+ req.query.sort + ")");
	}

	if(req.query.select != undefined)
	{
		select = eval("("+ req.query.select + ")");
	}

	if(req.query.skip != undefined)
	{
		skip = eval("("+ req.query.skip + ")");
	}

	if(req.query.limit != undefined)
	{
		limit = eval("("+ req.query.limit + ")");
	}


  User.find(where).limit(limit).sort(sort).exec(function(err, users) {

  	if(err)
  	{
  		console.log('we hit 500 in /users')
  		res.status(500).send({message: 'Could not get users!'})
  	}
  	else
  	{
  		console.log('we hit 200 in /users')
  		res.status(200).json({message: 'Ok!', data : users});
  	}

  });
});

userRoute.post(function(req, res){
	var user = new User();
	user.name = req.body.name;
	user.email = req.body.email;

	if(req.body.name === undefined || req.body.email === undefined)
	{
		res.status(500).send({message: 'Could not create user! Name and email must be defined!'})
	}

	else
	{
		user.save(function(err){
			if(err)
			{
				res.status(500).send({message: 'Could not create user! Email must be unique!'})
			}
			else
			{
				res.status(201).json({message: 'User created!', data : user});
			}
		});
	}
});

userRoute.options(function(req, res){
	res.writeHead(200);
	res.end();
});

//userSpecificRoute starts here

userSpecificRoute.get(function(req, res){
	User.findById(req.params.user_id, function(err, user){

		if(err)
		{
  		res.status(404).send({message: 'User does not exist!'})
  	}
  	else if(user === null)
  	{
  		res.status(404).send({message: 'User does not exist!'})
  	}
  	else
  	{
			res.status(200).json({message: 'Ok!', data : user});
		}
	});
});

userSpecificRoute.put(function(req, res){
	User.findById(req.params.user_id, function(err, user){

		if (err)
		{
			res.status(404).send({message: 'User does not exist!'})
		}
		else
		{
			user.name = req.body.name;
			user.email = req.body.email;
			user.pendingTasks = req.body.pendingTasks;

			user.save(function(err){
				if (err)
				{
					res.status(500).send({message: 'Could not save user!'})
				}
				else
				{
					res.status(200).json({message: 'Ok!', data : user})
				}
			});
		}
	});
});

userSpecificRoute.delete(function(req, res){
	User.remove({
		_id: req.params.user_id
	}, function(err, user){

		if (err)
		{
			res.status(404).send({message: 'User does not exist!'})
		}
		else if (user.result.n === 0)
		{
			res.status(404).send({message: 'User does not exist!'})
		}
		else
		{
			res.status(200).json({message: 'User deleted!'});
		}
	});
});

//taskRoute starts here

taskRoute.get(function(req, res) {
	var where = null;
	var count = null;
	var sort = null;
	var select = null;
	var skip = null;
	var limit = null;

	console.log('hey!!')

	if(req.query.where != undefined)
	{
		where = eval("("+ req.query.where + ")");
	}

	if(req.query.count != undefined)
	{
		count = eval("("+ req.query.count + ")");
	}

	if(req.query.sort != undefined)
	{
		sort = eval("("+ req.query.sort + ")");
	}

	if(req.query.select != undefined)
	{
		select = eval("("+ req.query.select + ")");
	}

	if(req.query.skip != undefined)
	{
		skip = eval("("+ req.query.skip + ")");
	}

	if(req.query.limit != undefined)
	{
		limit = eval("("+ req.query.limit + ")");
	}
	else
	{
		limit = eval("("+ 100 + ")");
	}


  Task.find(where).limit(limit).sort(sort).exec(function(err, tasks){

  	if(err)
  	{
  		res.status(500).send({message: 'Could not get tasks!'})
  	}
  	else
  	{
  		res.status(200).json({message: 'Ok!', data : tasks});
  	}
  });
});


taskRoute.post(function(req, res){

	var task = new Task();
	task.name = req.body.name;
	task.deadline = req.body.deadline;
	task.completed = false;


	if( req.body.assignedUser != undefined)
	{
		task.assignedUser = req.body.assignedUser;
	}
	else
	{
		task.assignedUser = "";
	}

	if( req.body.assignedUser != undefined)
	{
		task.assignedUserName = req.body.assignedUserName;
	}
	else
	{
		task.assignedUserName = "unassigned";
	}

	if( req.body.assignedUser != undefined)
	{
		task.description = req.body.description;
	}
	else
	{
		task.description = "";
	}

	console.log(req.body.assignedUser + " " + req.body.assignedUserName)

	task.save(function(err){
		if(err)
		{
			res.status(500).send({message: 'Could not create tasks!'})
		}
		else
		{
			res.status(201).json({message: 'Task created!', data: task });
			if(task.assignedUser != "")
			{
				User.findById(task.assignedUser, function(err, user){
					if(err)
					{
						//res.status(401).send({message: 'Could not get user!'})
					}
					else
					{
						user.pendingTasks.push(task._id);
						user.save(function(err){
							if (err)
							{
								//res.status(500).send({message: 'Could not save user!'})
							}
							else
							{
								//res.status(200).json({message: 'Ok!', data : user})
							}
						});		
					}

				});
			}
		}
	});
});

taskRoute.options(function(req, res){
	res.writeHead(200);
	res.end();
});


// taskSpecificRoute starts here

taskSpecificRoute.get(function(req, res){
	Task.findById(req.params.task_id, function(err, task){
		if(err)
		{
			res.status(500).send({message: 'Could not find task!'})
		}
		else
		{
			res.status(200).json({message: 'Ok!', data : task});
		}
	});
});

taskSpecificRoute.put(function(req, res){
	Task.findById(req.params.task_id, function(err, task){
		if(err)
		{
			res.status(505).send({message: 'Could not find task!'})
		}
		else
		{
			task.name = req.body.name;
			task.description = req.body.name;
			task.deadline = req.body.deadline;
			task.completed = req.body.completed;
			task.assignedUser = req.body.assignedUser;
			task.assignedUserName = req.body.assignedUserName;

			task.save(function(err){
				if (err)
				{
					res.status(500).send({message: 'Could not save task!'})
				}
				else
				{
					res.status(200).json({message: 'Ok!', data : task});
				}
			});
		}
	});
});

userSpecificRoute.delete(function(req, res){
	Task.remove({
		_id: req.params.task_id
	}, function(err, task){
		if(err)
		{
			res.status(505).send({message: 'Could not find task!'})
		}
		else
		{
			res.status(200).json({message: 'Task deleted!'});
		}
	});
});


// Start the server
app.listen(port);
console.log('Server running on port ' + port);
