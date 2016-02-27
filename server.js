var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1,
    description: 'Got to get the milk',
    completed: false
}, {
    id: 2,
    description: 'Don\'t forget the bread',
    completed: false
}, {
    id: 3,
    description: 'Fill the tank up with gas',
    completed: true
}];

app.get('/', function (req, res) {
    res.send('To-Do API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
    res.json(todos);
});
// GET /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoID = parseInt(req.params.id);
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

app.listen(PORT, function () {
    console.log('Express Server listening on port ' + PORT + '!');
});
