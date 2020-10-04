const { validationResult } = require('express-validator');
const User = require("../models/User");
const Auth = require("../auth");

module.exports = new class {
    redirectToDashboard(req, res, next) {
        req.session.isLoggedIn = true;
        res.redirect("/dashboard");
    }

    async logout(req,res, next) {
        try {
            let response = await req.session.destroy();
            res.send({
                data: response,
            });
        }
        catch(e) {
            console.log(e);
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
       
    }

    async getUser(req,res, next) {
        try {
            let response = req.user;
            res.send({
                data: response,
            });
        }
        catch(e) {
            console.log(e);
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    }

    async saveUser(req,res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.send( 
                    {
                        data:{
                            error: errors.array()[0].msg
                        } 
                    });
            }
            const user = await User.findAll({
                where: {email: req.body.email}
            });

            if(user.length > 0) {
                res.send({
                    data: {
                        error: "User already exist!"
                    }
                })
            } else {
                let password = await Auth.hashPassword(req.body.password);
                await User.create({
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    roles: "user",
                    emailVerified: false,
                    archieved: false,
                    password: password
                })
                res.send({
                    data: {
                        msg: "User is created Successfully!"
                    }
                })
            }
        }
        catch(e) {
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    }

    async tryLogin(req,res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.send( 
                    {
                        data:{
                            error: errors.array()[0].msg
                        } 
                    });
            }
            var email = req.body.email;
            var password = req.body.password;
            var user = await Auth.tryLogin(req, email, password);
           
            if(user) {
                res.send({
                    data: {
                        user
                    }
                })
            } else {
                res.send({
                    data: {
                        error: "Incorrect Email or password"
                    }
                })
            }
           
        }
        catch(e) {
            console.log(e);
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    }

    
}