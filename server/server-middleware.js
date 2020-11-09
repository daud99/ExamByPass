const { check, validationResult, body } = require('express-validator');

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
    },
    checkProductId: function() {
        return [
            check('product_id').exists().withMessage("Product id is missing").isString().withMessage("The product_id field needs to be string")
        ]
    },
    checkPromoCodeArchiveInfo: function() {
        return [
            check('id').exists().withMessage("promotion code id is missing").isString().withMessage("The id field needs to be string"),
            check('active').exists().withMessage("active field is require").isBoolean().withMessage("active field needs to be Boolean")
        ]
    },
    checkId: function() {
        return [
            check('id').exists().withMessage("id is required field").isString().withMessage("The id field needs to be string")
        ]
    },
    checkProductPriceInfo: function() {
        return [
            check('name').exists().withMessage("Name field is required").isString().withMessage("Name field should be of type string"),
            check('unit_amount').exists().withMessage('unit_amount field is required' ).isInt().withMessage("unit_amount needs to be integer"),
            check('interval').exists().withMessage("interval_count field is required").isString().withMessage("interval_count field should be of type string").matches(/year|month/).withMessage("The value of interval needs to be year or month"),
            check('interval_count').exists().withMessage('interval_count field is required' ).isInt().withMessage("interval_count needs to be integer").custom(value => {
                if(value <= 0) {
                    throw new Error('interval_count must be greater than or equal to 1');
                }
                return true;
              }),
        ]
    },
    checkCouponInfo: function() {
        return [
            check("duration").exists().withMessage("duration field is required").isString().isString("The duation fields needs to be string").matches(/once|repeating|forever/).withMessage("The value of duration needs to be once or repeating or forever"),
            check("amount_off").custom((value, {req})=>{
                if((value || value === 0) && (req.body.percent_off || req.percent_off === 0)) throw new Error("percent_off or amount_off either one of the field is required");
                if(value || value === 0) {
                    if(typeof value != "number") throw new Error("amount_off need to be a integer");
                    if(value <= 0) throw new Error("amount_off must be a positive interger greater than 0");
                    return true;
                } else {
                    if((!req.body.percent_off) && req.body.percent_off != 0) throw new Error("percent_off or amount_off either one of the field is required");
                    if(req.body.percent_off || req.body.percent_off === 0) {
                        if(typeof req.body.percent_off != "number") throw new Error("percent_off need to be a integer")
                        if(!(req.body.percent_off > 0 && req.body.percent_off <= 100)) throw new Error("percent_off needs to between 0 and 100"); 
                        return true;
                    }
                }
            }),
            check("duration_in_months").custom((value, {req}) => {
                if(req.body.duration === "repeating") {
                    if(!value || value < 0) throw new Error("duration_in_months is required and needs to be a postive interger");
                    return true;
                } else if(value) {
                    throw new Error("duration_in_months is not required it's only required when duration is set to repeating");
                } else {
                    return true;
                }
            }),
            check('max_redemptions').custom(value => {
                if(value || value === 0) {
                    if(value <= 0) throw new Error('max_redemptions needs to be a postive integer');
                }
                return true;
            }),
            check('redeem_by').custom(value => {
                if(value || value == 0) {
                    let date_time = Math.round(new Date(value).getTime());
                    let now_date_time = + new Date().getTime();
                    if(date_time <= now_date_time) throw new Error("redeem_by date needs to be in future");
                    return true;   
                }
                return true;
            })
        ]
    },
    checkPromotionCodeInfo: function() {
        return [
            check("coupon").exists().withMessage("coupon field is required").isString().withMessage("The coupon field needs to be string"),
            check('max_redemptions').custom(value => {
                if(value || value === 0) {
                    if(value <= 0) throw new Error('max_redemptions needs to be a postive integer');
                }
                return true;
            }),
            check('code').if(body('code') || body('code') == 0).isString().withMessage("code field needs to be string"),
            check('expires_at').custom(value => {
                if(value || value == 0) {
                    let date_time = Math.round(new Date(value).getTime());
                    let now_date_time = + new Date().getTime();
                    if(date_time <= now_date_time) throw new Error("expires_at date needs to be in future");
                    return true;   
                }
                return true;
            })
        ]
    }
};