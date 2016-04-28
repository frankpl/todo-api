var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
    // sequelize = new Sequelize('d7h3593njh5i8u', 'acibahdyzrrivf', 'lmrbvlvpqwEQHwHsRh7jud4w4F',{
    //     host: 'ec2-107-22-248-209.compute-1.amazonaws.com',
    //     dialect: 'postgres'
    });
} else {
    var sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/dev-todo-api.sqlite'
    });
}
var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;