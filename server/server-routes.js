var express = require('express');
var csrf = require('csurf')
var router = express.Router();
var Auth = require("./auth");
var Middleware = require("./server-middleware");

const db = require("./config/db.js")
const User = require("./models/User")
const Comment = require("./models/Comment")
const Discount = require("./models/Discount")
const discountApplicable = require("./models/discountApplicable")
const Invoice = require("./models/Invoice")
const Subscription = require("./models/Subscription")
const Ticket = require("./models/Ticket")
const Token = require("./models/Token")
const answerArea = require("./models/answerArea")
const examLibrary = require('./models/examLibrary.js')
const Question = require('./models/Question.js')
const resetPasswordRequest = require('./models/resetPasswordRequest.js')
const structureEntry = require('./models/structureEntry.js')
const structureEntryQuestionLink = require('./models/structureEntryQuestionLink.js')
const Testlet = require('./models/Testlet.js')
const Answer = require('./models/Answer')

var ParserController = require('./controllers/parserController');

// Local imports
const upload = require('./config/multer').upload;

var csrfProtection = csrf({ cookie: true });

router.post('/api/parser/uploadFile', [upload.single('file')], ParserController.uploadFile);
//Route for questions
router.get('/api/questions/:page', ParserController.getQuestions);
//Route for answers
router.get('/api/answers/:question_id', ParserController.getAnswers);
// Send CSRF token for session
router.get('/api/getcsrftoken', csrfProtection, function (req, res) {
    return res.json({ csrfToken: req.csrfToken() });
});
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

router.use(function(err, req, res, next) {
    res.status(400).send({
        error: 400,
        message: "Bad Request.",
    });
});

module.exports = router;
