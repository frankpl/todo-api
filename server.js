var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");

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
    res.json(todos);
});
// GET /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoID});
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send('No matching todo found');
    }
});

// POST new todo../todos/
app.post('/todos', function (req, res) {
    var body = req.body;
    body = _.pick(body, 'description', 'completed');

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    body.description = body.description.trim();

    body.id = todoNextId++;

    todos.push(body);
    res.json(body);
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


app.listen(PORT, function () {
    console.log('Express Server listening on port ' + PORT + '!');
});
