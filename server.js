var express = require("express");
var bodyParser = require("body-parser");

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
    var matchedTodo;
    todos.forEach (function (todo) {
        if (todo.id === todoID) {
            matchedTodo = todo;
        }
    });
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send('No matching todo found');
    }
});

// POST new todo../todos/
app.post('/todos', function (req, res) {
    var body = req.body;
    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
});


app.listen(PORT, function () {
    console.log('Express Server listening on port ' + PORT + '!');
});
