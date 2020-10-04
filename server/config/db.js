const Sequelize = require("sequelize")
module.exports =  new Sequelize('exam', 'root', '', {
    host: '25.34.216.242',
    dialect: 'mysql',
    pool:{
        max:5,
        min:0,
        acquire:5000,
        idle:10000
    },
});
