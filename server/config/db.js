const Sequelize = require("sequelize")
module.exports =  new Sequelize('exam', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
    pool:{
        max:5,
        min:0,
        acquire:5000,
        idle:10000
    },
});
