const { validationResult } = require('express-validator');
const Contact = require("../models/contact");
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
        res.send({
            data: {
                msg: "Your Message is sent Successfully!"
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