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
    var queryParams = req.query;
    var filteredTodos = todos;

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {completed: true});
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {completed: false});
    }

    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function(todo) {
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        });
    }

    res.json(filteredTodos);
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
    var matchedTodo = _.findWhere(todos, {id: todoID});
    if (matchedTodo) {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    } else {
        res.status(404).json({"Error": "No matching todo found"});
    }
});

// PUT method to update todos by id
app.put('/todos/:id', function(req, res) {
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoID});
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if (!matchedTodo) {
        res.status(404).json({"Error": "No matching todo found"});
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if(body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description.trim();
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
});

db.sequelize.sync().then(function() {
    app.listen(PORT, function () {
    console.log('Express Server listening on port ' + PORT + '!');
    });
});


