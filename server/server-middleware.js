const { check, validationResult } = require('express-validator');

module.exports = {

    // TODO reduce redundancy (use decorators)

    checkBasicUserInfo: function() {
        return [
            check('firstName').exists().withMessage("Enter a valid First Name").isString().withMessage("Enter a valid First Name").matches(/^([a-zA-Z ]+)$/, "i").withMessage("Enter a valid First Name"),
            check('lastName').exists().withMessage("Enter a valid Last Name").isString().withMessage("Enter a valid Last Name").matches(/^([a-zA-Z ]+)$/, "i").withMessage("Enter a valid Last Name"),
            check('email').exists().withMessage("Enter a valid Email").isEmail().withMessage("Enter a valid Email").normalizeEmail().withMessage("Enter a valid Email")
        ]
    },

    checkLoginUserInfo: function() {
        return module.exports.forgetEmailInfo().concat(module.exports.checkNewUserPassword());
    },

    forgetEmailInfo: function() {
        return [
            check('email').exists().withMessage("Enter a valid Email").isEmail().withMessage("Enter a valid Email").normalizeEmail().withMessage("Enter a valid Email")
        ]
    },

    checkNewUserInfo: function() {
        return module.exports.checkBasicUserInfo().concat(module.exports.checkNewUserPassword());
    },

    checkNewUserPassword: function() {
        return [
            check('password').exists().withMessage("Enter a valid Password").isString().isLength({ min: 4 }).withMessage("Enter a valid password length must be greater than 4"),
        ]
    },
    checkChangePasswordInfo: function() {
        return module.exports.checkLoginUserInfo().concat(module.exports.checkOldPassword());
    },
    checkOldPassword: function() {
        return [
            check('old_password').exists().withMessage("Enter a valid old Password").isString().isLength({ min: 4 }).withMessage("Enter a valid old password length must be greater than 4")
        ]
    },
    checkCharge: function() {
        return [
            check('charge').exists().withMessage("Charge field is missing").isBoolean().withMessage("The charge field needs to be boolean")
        ]
    }
};