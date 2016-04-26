var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('To-Do API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
    var query = req.query;
    var where = {};
    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }
    if (query.hasOwnProperty('q') && query.q.length > 0) {
        var val = '%'+query.q+'%';
        where.description = { $like: '%'+query.q+'%' };
    }
    db.todo.findAll({where: where}).then(function(todo) {
        if(todo.length > 0) {
         res.json(todo);
        } else {
            res.status(404).json("Nothing returned");
        }
    }, function (e) {
        res.status(500).send(e);
    });
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoID = parseInt(req.params.id, 10);
    db.todo.findById(todoID).then(function(todo) {
        if (!!todo) {
            res.json(todo.toJSON());
        }
        else {
            res.status(404).json("No matching todo found");
        }
}, function(e) {
    res.status(500).json(e);
});
});

// POST new todo../todos/
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function(todo) {
        res.json(todo.toJSON());
    }).catch(function(e) {
        return res.status(400).json(e);
    });
});

// delete is the http method and the  route is /todos/:id
app.delete('/todos/:id', function (req, res) {
    var todoID = parseInt(req.params.id, 10);
    var where = { id: todoID };
    db.todo.destroy({where: where}).then(function(todo) {
        if (todo > 0) {
            res.status(204).send();
        } else {
            res.status(404).json("No record found with that ID");
        }
    }, function(e) {
        res.status(500).json(e);
    });
});

// PUT method to update todos by id
app.put('/todos/:id', function(req, res) {
    var todoID = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};

    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    } 

    if (body.hasOwnProperty('description')) {
        attributes.description = body.description.trim();
    } 

    db.todo.findById(todoID).then(function(todo) {
        if (todo) {
            todo.update(attributes).then(function (todo) {
                res.json(todo.toJSON());
            }, function(e) {
                res.status(400).json(e);
            });
        } else {
            res.status(404).send();
        }
    }, function(e) {
        res.status(500).send();
    });
});

// POST for user model
app.post('/users', function(req, res) {
    var body = _.pick(req.body, 'email', 'password');

    db.user.create(body).then(function(user) {
        res.json(user.toJSON());
    }).catch(function(e) {
        return res.status(400).json(e);
    });
});

db.sequelize.sync().then(function() {
    app.listen(PORT, function () {
    console.log('Express Server listening on port ' + PORT + '!');
    });
});


