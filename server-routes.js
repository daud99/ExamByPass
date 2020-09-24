var express = require('express');
var csrf = require('csurf')
var router = express.Router();
var Auth = require("./auth");
var Middleware = require("./server-middleware");

var ParserController = require('./controllers/parserController');

// Local imports
const upload = require('./config/multer').upload;

var csrfProtection = csrf({ cookie: true });

router.post('/parser/uploadFile', [upload.single('file')], ParserController.uploadFile);

// Send CSRF token for session
router.get('/api/getcsrftoken', csrfProtection, function (req, res) {
    return res.json({ csrfToken: req.csrfToken() });
});

router.use(function(err, req, res, next) {
    res.status(400).send({
        error: 400,
        message: "Bad Request.",
    });
});

module.exports = router;
