
const Sequelize = require("sequelize");

// server's DB configuration

// module.exports = new Sequelize("exam", "root", "", {
//   host: "25.34.216.242",
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 6000,
//     idle: 10000,
//   },
// })


//usman's DB configuration
// module.exports = new Sequelize("exam", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 6000,
//     idle: 10000,
//   },
// })


// daud's DB configuration
module.exports =  new Sequelize('exambypass', 'root', 'toor', {
    host: 'localhost',
    dialect: 'mysql',
    pool:{
        max:5,
        min:0,
        acquire:5000,
        idle:10000
    },
});
