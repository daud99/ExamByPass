const express = require('express')
const router = express.Router()
const db = require("../config/db.js")
const User = require("../models/User")
const Comment = require("../models/Comment")
const Discount = require("../models/Discount")
const discountApplicable = require("../models/discountApplicable")
const Invoice = require("../models/Invoice")
const Subscription = require("../models/Subscription")
const Ticket = require("../models/Ticket")
const Token = require("../models/Token")
const answerArea = require("../models/answerArea")
const examLibrary = require('../models/examLibrary.js')
const Question = require('../models/Question.js')
const resetPasswordRequest = require('../models/resetPasswordRequest.js')
const structureEntry = require('../models/structureEntry.js')
const structureEntryQuestionLink = require('../models/structureEntryQuestionLink.js')
const Testlet = require('../models/Testlet.js')
const Answer = require('../models/Answer')

 router.get('/',(req,res) => {
    User.hasMany(Token)
    User.hasMany(Invoice)
    User.hasMany(discountApplicable)
    User.hasMany(Discount)
    User.hasMany(Ticket)
    User.hasMany(examLibrary)
    User.hasMany(resetPasswordRequest)
    
    examLibrary.hasMany(Question)
    examLibrary.hasMany(structureEntry)
    examLibrary.hasMany(structureEntryQuestionLink)
    examLibrary.hasMany(Testlet)
    
    Question.hasMany(Answer)
    Question.hasMany(structureEntryQuestionLink)
    
    structureEntry.hasMany(structureEntryQuestionLink)
    
    Subscription.hasMany(User)
    
    Testlet.hasMany(Question)
    
    Ticket.hasMany(Comment)
    
    Answer.hasMany(answerArea)
db.sync({force: false}).then(function () {
    console.log("Database Configured");
});

}
)
router.get('/get',(req,res) => 
User.findAll().
then(user =>{
    console.log(user);
    res.sendStatus(200);
})
.catch(err => console.log("error is " + err))

)
module.exports = router