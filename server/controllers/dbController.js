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
const examLibraryUser = require('../models/examLibraryUser')
const Question = require('../models/Question')
const structureEntry = require('../models/structureEntry')
const resetPasswordRequest = require('../models/resetPasswordRequest')
const structureEntryQuestionLink = require('../models/structureEntryQuestionLink')
const Testlet = require('../models/Testlet')
const Answer = require('../models/Answer')

const Product = require('../models/Product')
const Price = require('../models/Price')
const MaxSession = require('../models/MaxSession')
const Coupon = require('../models/Coupon')
const promotionCode = require('../models/promotionCode')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Keys = require("../config/Keys")
const Auth = require("../auth")
const Db = require("../config/db")

module.exports = new class {
    async syncDB(req, res, next) {
        try {
            User.hasMany(Session)
            User.hasMany(Invoice)
            User.hasMany(discountApplicable)
            User.hasMany(Discount)
            User.hasMany(Ticket)
            User.hasMany(examLibrary, {foreignKey: {name: 'user_id', allowNull: true}})
    //         User.belongsToMany(examLibrary, {
    //             through: 'examUser',
    //               foreignKey: "user_id",
    //   });
            User.hasMany(resetPasswordRequest)
            User.hasMany(Invoice)
            User.hasMany(Coupon)
            User.hasOne(Subscription)
            User.belongsToMany(examLibrary, { through: examLibraryUser });
            examLibrary.belongsToMany(User, { through: examLibraryUser });
            Product.hasOne(Price, { foreignKey: 'productPid' })
            Product.hasMany(Invoice, { foreignKey: 'productPid' })
            Invoice.belongsTo(Product)
            Coupon.hasOne(Invoice,{onDelete: 'CASCADE',foreignKey: 'coupon_id'})
            Invoice.belongsTo(Coupon,{onDelete: 'CASCADE'})
            Subscription.belongsTo(User)
            examLibrary.hasMany(Question)
            examLibrary.hasMany(structureEntry)
            examLibrary.hasMany(structureEntryQuestionLink)
            examLibrary.hasMany(Testlet)
    //          examLibrary.belongsToMany(User, {
    //              through: 'examUser',
    //                foreignKey: "exam_library_id",
    //   });
            Coupon.hasMany(promotionCode)
            promotionCode.belongsTo(Coupon)
            Question.hasMany(Answer)
            Question.hasMany(structureEntryQuestionLink)
            structureEntry.hasMany(structureEntryQuestionLink)
            Testlet.hasMany(Question)
            Ticket.hasMany(Comment)
            Answer.hasMany(answerArea)

            await Db.sync({force: true}).then(function () {
                console.log("Database Configured");
            });
            const returnData = await module.exports.populateDB();
            return res.status(200).send(returnData);
        }
        catch(e) {
            console.log(e);
            res.send({
                error: e.toString()
            })
        }
        
    } 

    async populateDB() {
        console.log("starting populating DB");
        try {
            const products = await stripe.products.list({
                limit: 100,
            });
            console.log(products);
            if(products.data.length > 0) {
                for (const element in products.data) {
                    await Product.create({
                        pid: products.data[element].id,
                        name: products.data[element].name,
                           active: products.data[element].active 
                    });
                }
            }
            const prices = await stripe.prices.list({
                limit: 100,
            });
            if(prices.data.length > 0) {
                for (const element in prices.data) {
                    console.log(prices.data[element].product);
                    await Price.create({
                        pid: prices.data[element].id,
                        currency: prices.data[element].currency,
                        interval: prices.data[element].recurring.interval,
                        amount: prices.data[element].unit_amount/100,
                        productPid: prices.data[element].product
                    },
                    { fields: ["pid", "currency", "interval", "amount", "productPid"] }   
                    );
                }
            }

            await User.create({
                firstName: "admin",
                lastName: "admin",
                email: "admin@admin.com",
                roles: "admin",
                password: await Auth.hashPassword("admin")
            });

            await MaxSession.create({
                max_session_allow: 3
            });
            console.log("Database populated successfully");
            return {
                msg: "DB is initialized and populated successfully"
            };
        } catch(e) {
            console.log("Error while populaiton database");
            console.log(e);
            return {
                error: e.toString()
            };
        }

    }

};