const { validationResult } = require('express-validator');
const Contact = require("../models/contact");
const EmailConfig = require("../config/email")
var nodemailer = require("nodemailer")
const fs = require('fs')
var ejs = require('ejs')
const SiteConfig = require("../config/site")
module.exports = new class {
async saveContactUs(req,res, next) {
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

        await Contact.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            problemType: req.body.problemType,
            message: req.body.message
        })
        var emailHTML = `
            <div>
                <h4>First Name</h4>:<p>${req.body.firstName}</p>
                <h4>Last Name</h4>:<p>${req.body.lastName}</p>
                <h4>Email</h4>:<p>${req.body.email}</p>
                <h4>Problem Type</h4>:<p>${req.body.problemType}</p>
                <h4>Message</h4>:<p>${req.body.message}</p>
            </div>
            `
        try {
      
            let transporter = nodemailer.createTransport({
                host: EmailConfig.host,
                port: EmailConfig.port,
                secure: EmailConfig.secure,
                auth: {
                    user: EmailConfig.username,
                    pass: EmailConfig.password
                }
            });
            
            // send mail with defined transport object
            let info = await transporter.sendMail({
                to: req.body.email, // list of receivers
                subject: "Message Recieved", // Subject line
                html: emailHTML // html body
            });
            res.send({
                data: {
                    msg: "Message Sent Successfully! and Emailed to you"
                }
            })  
        } catch(e) {
  
            return false;
  
        }

        
    }
    catch(e) {
        console.log(e)
        res.status(400).send({
        "status": 400,
        "error": "Bad Request",
        });
    }
    }
    
    async getAllMessages(req,res, next) {
        try {
            const messages = await Contact.findAll({});
            res.send({
                data: {
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

    async deleteMessages(req,res, next) {
        try {
            const messages = await Contact.destroy({
                where: {
                    id: req.body.id
                }
            });
            console.log(messages)
            res.send({
                data: {
                    msg: "Message deleted Successfully!",
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
}
