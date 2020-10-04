const Sequelize = require("sequelize")
module.exports =  new Sequelize('ExamByPass', 'root', 'toor', {
    host: 'localhost',
    dialect: 'mysql',
    pool:{
        max:5,
        min:0,
        acquire:5000,
        idle:10000
    },
});
