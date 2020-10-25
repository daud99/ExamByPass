
const Sequelize = require("sequelize");




// usman's DB configuration
module.exports = new Sequelize("exam", "root", "", {
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 6000,
    idle: 10000,
  },
})


// daud's DB configuration
// module.exports =  new Sequelize('exambypass', 'root', 'toor', {
//     host: 'localhost',
//     dialect: 'mysql',
//     pool:{
//         max:5,
//         min:0,
//         acquire:5000,
//         idle:10000
//     },
// });
