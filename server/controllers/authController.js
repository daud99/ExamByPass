const { validationResult } = require('express-validator');
const User = require("../models/User");
const Auth = require("../auth");
const Subscription = require('../models/Subscription');
const Session = require('../models/Session');
const MaxSession = require('../models/MaxSession')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
            if(!response) {
                return res.send({
                    data: response,
                });
            }
            const user_sessions = await Session.count({where: {
                user_id: req.user.id
            }});
            const max_session_allowed = await MaxSession.findOne({}); 
            if(user_sessions > max_session_allowed.dataValues.max_session_allow) {
                await req.session.destroy();
                return res.send({
                    data: {
                        error: "You have reached the maximum concurrent sessions allowed, Kindly logout of one of the already logged in places to log in successfully"
                    }
                })
            } else if(req.user.archieved) {
                await req.session.destroy();
                return res.send({
                    data: {
                        error: "You are not allowed to logged in, please contact us in case of any problem!"
                    }
                })
            } 
            else {
                let subscription = await req.user.getSubscription();
                subscription? response.dataValues.subscription_status = subscription.status: response.dataValues.subscription_status = 'not_subscribed';
                response.dataValues.auth_type = 'OAuth';
                res.send({
                    data: response,
                });
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

    async retrieveUser(req,res, next) {
        try {
            const user = await User.findOne({
                where: {
                    id: req.query.paramS
                }
            });
            res.send({
                data: {
                    user
                }
            })
        }
        catch(e) {
            console.log(e)
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    }
    async saveUser(req,res, next) {
        console.log(req.body)
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
                const customer = await stripe.customers.create({
                    email: req.body.email,
                });
                let password = await Auth.hashPassword(req.body.password);
                await User.create({
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    roles: "user",
                    emailVerified: false,
                    archieved: false,
                    password: password,
                    stripeId: customer.id
                });
                Auth.sendVerificationEmail(req.body.email);

                res.send({
                    data: {
                        msg: "User is created Successfully!",
                        msg2: "You will shortly receive the verificaiton email, kindly verify your email!"
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
    
    async getAllusers(req,res, next) {
        try {
            const users = await User.findAll({include:[Subscription,Session]});
            console.log(users)
            res.send({
                data: {
                    users
                }
            })
        }
        catch(e) {
            console.log(e)
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    }
    async getSessionsAlloweds(req,res, next) {
        try {
            const sess = await MaxSession.findAll({});
            console.log(sess)
            res.send({
                data: {
                    sess
                }
            })
        }
        catch(e) {
            console.log(e)
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    }

    async changeAllowedsessions(req,res, next) {
        try {
            const sess = await MaxSession.findOne({
                where: {id: 1}
            });
            console.log('llll')
            console.log(req.body)
            console.log(sess)
            console.log('hhhh')
            if(sess){
                const updateSessions = await sess.update({
                        max_session_allow: req.body.max_session_allow
                    });
                    res.send({
                    data: {
                        msg: "Session Allowed Updated successfully",
                        record: updateSessions
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

    async deleteUserSession(req,res, next) {
        try {
            const session = await Session.destroy({
                where: {
                    user_id: req.body.id
                }
            });
            res.send({
                data: {
                    msg: "User Session deleted Successfully!"
                }
            })
        }
        catch(e) {
            console.log(e)
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    }

    async deleteUser(req,res, next) {
        try {
            const messages = await User.destroy({
                where: {
                    id: req.body.id
                }
            });
            res.send({
                data: {
                    msg: "User deleted Successfully!",
                    messages
                }
            })
        }
        catch(e) {
            console.log(e)
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    }

    async archiveUser(req,res, next) {
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
                where: {id: req.body.id}
            });

            if(user) {
                const updateUser = await user.update({
                    archieved: req.body.archieved
                  });
                  res.send({
                    data: {
                        msg: "User Updated successfully",
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
    
    async verifyFromEmailUser(req,res, next) {
        console.log(req.body)
        try {
            const user = await User.findOne({
                where: {verification_token: req.body.token}
            });
            console.log(user)
            if(user) {
                const updateUser = await user.update({
                    emailVerified: req.body.verify
                  });
                  res.send({
                    data: {
                        msg: "User verified successfully",
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

    async adminUpdateUser(req,res, next) {
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
                    roles: req.body.roles,
                    phoneNumber: req.body.phoneNumber,
                    emailVerified: req.body.emailVerified
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
                const user_sessions = await Session.count({where: {
                    user_id: user.id
                }});
                const max_session_allowed = await MaxSession.findOne({}); 
                if(user_sessions >= max_session_allowed.dataValues.max_session_allow) {
                    await req.session.destroy();
                    return res.send({
                        data: {
                            error: "You have reached the maximum concurrent sessions allowed, Kindly logout of one of the already logged in places to log in successfully"
                        }
                    })
                }else if(user.archieved) {
                    await req.session.destroy();
                    return res.send({
                        data: {
                            error: "You are not allowed to logged in, please contact us in case of any problem!"
                        }
                    })
                }  
                else {
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
                }
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