const User = require("../models/User")
const Comment = require("../models/Comment")
const Discount = require("../models/Discount")
const discountApplicable = require("../models/discountApplicable")
const Invoice = require("../models/Invoice")
const Subscription = require("../models/Subscription")
const Ticket = require("../models/Ticket")
const Session = require("../models/Session")
const answerArea = require("../models/answerArea")
const examLibrary = require('../models/examLibrary')
const Question = require('../models/Question')
const structureEntry = require('../models/structureEntry')
const resetPasswordRequest = require('../models/resetPasswordRequest')
const structureEntryQuestionLink = require('../models/structureEntryQuestionLink')
const Testlet = require('../models/Testlet')
const Answer = require('../models/Answer')

const Keys = require("../config/Keys")
const Db = require("../config/db")

module.exports = new class {
    async syncDB(req, res, next) {
        User.hasMany(Session)
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

        Db.sync({force: true}).then(function () {
            console.log("Database Configured");
        });
    }
};