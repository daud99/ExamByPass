
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
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
router.get('/login/github', passport.authenticate('github', { scope: ['email'] }));
router.get('/login/google/return', [passport.authenticate('google', { failureRedirect: '/login' })], AuthController.redirectToDashboard);
router.get('/login/facebook/return', [passport.authenticate('facebook', { failureRedirect: '/login' })], AuthController.redirectToDashboard);
router.get('/login/github/return', [passport.authenticate('github', { failureRedirect: '/login' })], AuthController.redirectToDashboard);
router.post('/api/login/logout', [Auth.isAuthenticated], AuthController.logout);
router.post('/api/auth/update-user', [Auth.isAuthenticated],Middleware.checkBasicUserInfo(), AuthController.updateUser);
router.post('/api/contactUs', Middleware.checkBasicUserInfo(), contactUsController.saveContactUs);
router.get('/api/getSingleUser',[ Auth.isAuthenticated ], AuthController.retrieveUser);
router.post('/api/auth/update-user-byAdmin', [Auth.isAuthenticated],Middleware.checkBasicUserInfo(), AuthController.adminUpdateUser);


router.post('/api/saveExamsession', userExamsessionController.saveSessionExam);
router.get('/api/getExamsession', userExamsessionController.getSessionExam);
router.post('/api/deleteExamsession', userExamsessionController.deleteSessionExam);
router.post('/api/verifyWithEmailUser', AuthController.verifyFromEmailUser);

router.post('/api/auth/get-user', AuthController.getUser);
router.post('/api/auth/save-user', [ Auth.isNotAuthenticated ], Middleware.checkNewUserInfo() , AuthController.saveUser);
router.post('/api/auth/log-in', [Auth.isNotAuthenticated], Middleware.checkLoginUserInfo(), AuthController.tryLogin);
router.post('/api/auth/recover-password', [Auth.isNotAuthenticated], Middleware.forgetEmailInfo(), AuthController.recoverPassword);
router.post('/api/auth/change-password', [Auth.isAuthenticated], Middleware.checkChangePasswordInfo(), AuthController.changePassword);
router.post('/api/auth/update-password', [Auth.isNotAuthenticated], AuthController.updatePassword);


// Stripe Routes 
router.post('/api/create-checkout-session', StripeController.createCheckoutSession);
router.post('/api/create-customer', [Auth.isAuthenticated], StripeController.createCustomer);
router.post('/api/get-subscription', [Auth.isAuthenticated], StripeController.getSubscription);
router.post('/api/get-invoices', [Auth.isAuthenticated], StripeController.getInvoices);
router.post('/api/create-subscription', [Auth.isAuthenticated, Auth.isUnSubscribed], StripeController.createSubscription);
router.post('/api/cancel-subscription', [Auth.isAuthenticated, Auth.isSubscribed], Middleware.checkCharge(), StripeController.updateAutoChargeSubscription);
router.post('/api/assign-subscription', [Auth.isAuthenticatedAndAdmmin], StripeController.assignSubscriptionToUser);
router.post('/api/delete-self-assign-subscription', [Auth.isAuthenticatedAndAdmmin], Middleware.checkId(), StripeController.deleteSubscription);
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), StripeController.webHook);

router.get('/api/getInvoices',[Auth.isAuthenticatedAndAdmmin], StripeController.getAllInvoices);
router.get('/api/getSubscriptions',[Auth.isAuthenticatedAndAdmmin], SubscriptionManagementController.getAllSubscriptions);
router.get('/api/getAdminSubSubscriptions',[Auth.isAuthenticatedAndAdmmin], SubscriptionManagementController.getAllAdminSubSubscribescriptions);
router.get('/api/getSessionAllowed', AuthController.getSessionsAlloweds);
router.post('/api/sessionallowedUpdate',[Auth.isAuthenticatedAndAdmmin], AuthController.changeAllowedsessions);
router.post('/api/deleteUserSession',[Auth.isAuthenticatedAndAdmmin], AuthController.deleteUserSession);

router.post('/webhook', bodyParser.raw({type: 'application/json'}), StripeController.webHook);
// Admin Panel
router.get('/api/getMessages', [Auth.isAuthenticatedAndAdmmin], contactUsController.getAllMessages);
router.post('/api/deleteMessages',[Auth.isAuthenticatedAndAdmmin], contactUsController.deleteMessages);
router.get('/api/getUsers', [Auth.isAuthenticatedAndAdmmin], AuthController.getAllusers);
router.post('/api/deleteUsers',[Auth.isAuthenticatedAndAdmmin], AuthController.deleteUser);
router.post('/api/archivedUser',[Auth.isAuthenticatedAndAdmmin], AuthController.archiveUser);
router.post('/api/list-products', [Auth.isAuthenticatedAndAdmmin], StripeController.listAllProducts);
router.post('/api/get-prices',  StripeController.getPrices);
router.post('/api/create-product', [Auth.isAuthenticatedAndAdmmin], Middleware.checkProductPriceInfo(), StripeController.createProduct);
router.post('/api/update-product', [Auth.isAuthenticatedAndAdmmin], Middleware.checkProductId(), StripeController.updateProduct);

router.get('/api/getAllCoupons',   Middleware.checkCouponInfo(),[Auth.isAuthenticatedAndAdmmin], StripeController.getAllCoupens);
router.post('/api/create-coupon', [Auth.isAuthenticatedAndAdmmin], Middleware.checkCouponInfo(), StripeController.createCoupon);
router.post('/api/delete-coupon', [Auth.isAuthenticatedAndAdmmin], Middleware.checkId(), StripeController.deleteCoupon);
router.post('/api/create-promotion-code', [Auth.isAuthenticatedAndAdmmin], Middleware.checkPromotionCodeInfo(), StripeController.createPromotionCode);
router.post('/api/archive-promotion-code', [Auth.isAuthenticatedAndAdmmin], Middleware.checkPromoCodeArchiveInfo(), StripeController.archivePromotionCode);



// Exam 
router.post('/api/saveExamsession', userExamsessionController.saveSessionExam);
router.get('/api/getExamsession', userExamsessionController.getSessionExam);
router.post('/api/deleteExamsession', userExamsessionController.deleteSessionExam);
router.get('/api/getGuestExamsession', userExamsessionController.getGuestSessionExam);
router.post('/api/deleteGuestExamsession', userExamsessionController.deleteGuestSessionExam);
//Route for subscription
router.get('/api/getSubscription', ParserController.getSubscription);

router.get("/api/exams/:uuid", ParserController.getExams);
router.get("/api/guestExam/:gid", ParserController.getGuestExam);
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
//Route for deleting exam library
router.put("/api/delete/:examId", ParserController.deleteExam);
//Route for recover deleted exam library
router.put("/api/recover/:examId", ParserController.recoverExam);
//Route for admin to assign exam library
router.post("/api/assignExam", ParserController.assignExam);
//Route for admin to unassign exam library
router.delete("/api/unassignExam", ParserController.unassignExam);
//Route for updating session status
router.put("/api/updateSessionStatus", userExamsessionController.updateSessionStatus);



// DB Routes
router.get('/syncDB', DbController.syncDB);




// Subscription Management Routes
router.post('/api/subscription-management/get-subscription-status', [Auth.isAuthenticated], SubscriptionManagementController.getSubscriptionStatus);

// Parser Routes
router.post('/api/parser/uploadFile', [upload.single('file')], ParserController.uploadFile);


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
