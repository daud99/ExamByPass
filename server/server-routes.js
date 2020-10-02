var express = require('express')
var csrf = require('csurf')
var router = express.Router()
const passport = require('passport')
var Auth = require("./auth")
var Middleware = require("./server-middleware")
var ParserController = require('./controllers/parserController')
var AuthController = require('./controllers/authController')
var DbController = require('./controllers/dbController')

// Local imports
const upload = require('./config/multer').upload;
var csrfProtection = csrf({ cookie: true });

// router.get('/dashboard', Auth.isAuthenticated);

router.get('/login/google', passport.authenticate('google', { scope: ['email'] }));
router.get('/login/google/return', [passport.authenticate('google')], AuthController.redirectToDashboard);


router.get('/syncDB', DbController.syncDB);

router.post('/api/login/logout', [Auth.isAuthenticated], AuthController.logout);
router.post('/api/auth/get-user', AuthController.getUser);
router.post('/api/auth/save-user', [ Auth.isNotAuthenticated ], Middleware.checkNewUserInfo() , AuthController.saveUser);
router.post('/api/auth/log-in', [Auth.isNotAuthenticated], Middleware.checkLoginUserInfo(), AuthController.tryLogin);
router.post('/api/parser/uploadFile', [upload.single('file')], ParserController.uploadFile);

// Send CSRF token for session
router.get('/api/getcsrftoken', csrfProtection, function (req, res) {
    return res.json({ csrfToken: req.csrfToken() });
});

router.use(function(err, req, res, next) {
    console.log("here sending bad request");
    res.status(400).send({
        error: 400,
        message: "Bad Request.",
    });
});

module.exports = router;
