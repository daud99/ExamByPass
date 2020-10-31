
var express = require('express')
var csrf = require('csurf')
var router = express.Router()
const bodyParser = require('body-parser')
const passport = require('passport')
var Auth = require("./auth")
var Middleware = require("./server-middleware")
var ParserController = require('./controllers/parserController')
var AuthController = require('./controllers/authController')
var DbController = require('./controllers/dbController')
var StripeController = require('./controllers/stripeController')
var SubscriptionManagementController = require('./controllers/subscriptionManagementController')
var contactUsController = require('./controllers/contactUsController')
var userExamsessionController = require('./controllers/userExamsessionController')
// Local imports
const upload = require("./config/multer").upload;
var csrfProtection = csrf({ cookie: true });


// Auth Routes
router.get('/login/google', passport.authenticate('google', { scope: ['profile','email'] }));
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/login/github', passport.authenticate('github', { scope: ['email'] }));
router.get('/login/google/return', [passport.authenticate('google', { failureRedirect: '/login' })], AuthController.redirectToDashboard);
router.get('/login/facebook/return', [passport.authenticate('facebook', { failureRedirect: '/login' })], AuthController.redirectToDashboard);
router.get('/login/github/return', [passport.authenticate('github', { failureRedirect: '/login' })], AuthController.redirectToDashboard);
router.post('/api/login/logout', [Auth.isAuthenticated], AuthController.logout);

router.post('/api/auth/update-user', [Auth.isAuthenticated],Middleware.checkBasicUserInfo(), AuthController.updateUser);
router.post('/api/contactUs', Middleware.checkBasicUserInfo(), contactUsController.saveContactUs);
router.get('/api/getMessages', contactUsController.getAllMessages);
router.post('/api/deleteMessages', contactUsController.deleteMessages);
router.get('/api/getUsers', AuthController.getAllusers);
router.post('/api/deleteUsers', AuthController.deleteUser);
router.post('/api/archivedUser', AuthController.archiveUser);

router.post('/api/saveExamsession', userExamsessionController.saveSessionExam);
router.get('/api/getExamsession', userExamsessionController.getSessionExam);
router.post('/api/deleteExamsession', userExamsessionController.deleteSessionExam);

router.post('/api/auth/get-user', AuthController.getUser);
router.post('/api/auth/save-user', [ Auth.isNotAuthenticated ], Middleware.checkNewUserInfo() , AuthController.saveUser);
router.post('/api/auth/log-in', [Auth.isNotAuthenticated], Middleware.checkLoginUserInfo(), AuthController.tryLogin);
router.post('/api/auth/recover-password', [Auth.isNotAuthenticated], Middleware.forgetEmailInfo(), AuthController.recoverPassword);
router.post('/api/auth/change-password', [Auth.isAuthenticated], Middleware.checkChangePasswordInfo(), AuthController.changePassword);
router.post('/api/auth/update-password', [Auth.isNotAuthenticated], AuthController.updatePassword);

// DB Routes
router.get('/syncDB', DbController.syncDB);

// Stripe Routes 
router.post('/api/create-checkout-session', StripeController.createCheckoutSession);
router.post('/api/get-subscription', [Auth.isAuthenticated], StripeController.getSubscription);
router.post('/api/cancel-subscription', [Auth.isAuthenticated], StripeController.cancelSubscription);
router.post('/webhook', bodyParser.raw({type: 'application/json'}),StripeController.webHook);

// Subscription Management Routes
router.post('/api/subscription-management/get-subscription-status', [Auth.isAuthenticated], SubscriptionManagementController.getSubscriptionStatus);

// Parser Routes
router.post('/api/parser/uploadFile', [upload.single('file')], ParserController.uploadFile);
//Route for allExams
router.get("/api/exams", ParserController.getExams);
//Route for questions
router.get("/api/questions/:page/:examId/:selectedCheck/:structureEntryQuestionn", ParserController.getQuestions);
//Route for questions types
router.get("/api/types/:examId", ParserController.getTypes);
//Route for case study(Testlet)
router.get("/api/testlet/:examId", ParserController.getTestlet);
//Route for answers
router.get("/api/answers/:question_id", ParserController.getAnswers);
//Route for answers_area
router.get("/api/answers_area/:answer_id", ParserController.getAnswersArea);
//Route for structure entry
router.get("/api/structureEntry/:examId", ParserController.structureEntry);
//Route for structure entry Question
router.get("/api/structureEntryQuestion/:structureId", ParserController.structureEntryQuestion);

// Send CSRF token for session
router.get("/api/getcsrftoken", csrfProtection, function (req, res) {
  return res.json({ csrfToken: req.csrfToken() });
});


router.use(function(err, req, res, next) {
   res.status(400).send({
        error: 400,
        message: "Bad Request.",
    });
});

module.exports = router;
