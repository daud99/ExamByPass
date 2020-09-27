const Sequelize = require("sequelize")
module.exports =  new Sequelize('exam', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    pool:{
        max:5,
        min:0,
        acquire:3000,
        idle:10000
    },
});
