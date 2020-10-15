const { validationResult } = require('express-validator');
const User = require("../models/User");
const Auth = require("../auth");
const Subscription = require('../models/Subscription');

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
            let subscription = await req.user.getSubscription();
            subscription? response.dataValues.subscription_status = subscription.status: response.dataValues.subscription_status = 'not_subscribed';
            response.dataValues.auth_type = 'OAuth';
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

    async updateUser(req,res, next) {
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
            const user = await User.findOne({
                where: {email: req.body.email}
            });

            if(user) {
                const updateUser = await user.update({
                    emial: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                  });
                  res.send({
                    data: {
                        msg: "User updated successfully",
                        record: updateUser
                    }
                }) 
            } else {
                res.send({
                    data: {
                        msg: "User doesn't exist"
                    }
                })
            }
        }
        catch(e) {
            console.log("error");
            console.log(e);
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
                let subscription = await Subscription.findOne({
                    where: {user_id: user.id}
                  });
                subscription? user.subscription_status = subscription.status: user.subscription_status = 'not_subscribed';
                user.auth_type = 'LocalAuth';
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
    async recoverPassword(req, res, next) {
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
            const email = req.body.email;
            try {

                const result = await Auth.sendRecoveryEmail(email);
                if(result === true) {
                    res.send({
                        data: {
                            msg: "Email is sent successfully, Kindly check your email to reset password."
                        }
                    })
                } else {
                    res.send({
                        data: {
                            error: "Something went wrong while sending email"
                        }
                    })
                }

            } catch (e) {

                res.status(401).send({
                    error: 401,
                });

            }

        } catch (e) {
            res.status(400).send({
                "status": 400,
                "error": "Bad Request",
            });
        }

    }

    async updatePassword(req, res, next) {
        try {
            var password = req.body.password;
            var token = req.body.token;

            try {

                const result = await Auth.updateRecoverPassword(password, token);

                if(result === true) {
                    res.send({
                        data: {
                            "msg": "Password is reset successfully!"
                        }
                    });
                } else {
                    res.send({
                        data: {
                            "error": "Something went wrong while the resetting the password!"
                        }
                    })
                }
               

            } catch (e) {
                console.log(e);
                res.status(401).send({
                    error: 401,
                });

            }

        } catch (e) {
            res.status(400).send({
                "status": 400,
                "error": "Bad Request",
            });
        }
    }



    async changePassword(req, res, next) {
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
            var old_password = req.body.old_password;

            try {

                const result = await Auth.changePassword(email, password, old_password);

                if(result === true) {
                    res.send({
                        data: {
                            "msg": "Password is change successfully!"
                        }
                    });
                } else {
                    res.send({
                        data: {
                            "error": "Make sure you enter the right old password!"
                        }
                    })
                }
               

            } catch (e) {
                console.log(e);
                res.status(401).send({
                    error: 401,
                });

            }

        } catch (e) {
            res.status(400).send({
                "status": 400,
                "error": "Bad Request",
            });
        }
    }
    
}