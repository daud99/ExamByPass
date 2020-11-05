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
const Product = require('../models/Product')
const Price = require('../models/Price')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Keys = require("../config/Keys")
const Db = require("../config/db")
const { compareSync } = require("bcrypt")

module.exports = new class {
    async syncDB(req, res, next) {
        User.hasMany(Session)
        User.hasMany(Invoice)
        User.hasMany(discountApplicable)
        User.hasMany(Discount)
        User.hasMany(Ticket)
        User.hasMany(examLibrary)
        User.hasMany(resetPasswordRequest)
        User.hasMany(Invoice)
        User.hasOne(Subscription)
        Product.hasOne(Price, { foreignKey: 'productPid' })
        Product.hasMany(Invoice, { foreignKey: 'productPid' })
        Invoice.belongsTo(Product)
        Subscription.belongsTo(User)
        examLibrary.hasMany(Question)
        examLibrary.hasMany(structureEntry)
        examLibrary.hasMany(structureEntryQuestionLink)
        examLibrary.hasMany(Testlet)
        Question.hasMany(Answer)
        Question.hasMany(structureEntryQuestionLink)
        structureEntry.hasMany(structureEntryQuestionLink)
        Testlet.hasMany(Question)
        Ticket.hasMany(Comment)
        Answer.hasMany(answerArea)

        await Db.sync({force: true}).then(function () {
            console.log("Database Configured");
        });
        await module.exports.populateDB();
    } 

    async populateDB() {
        console.log("starting populating DB");
        try {
            const products = await stripe.products.list({
                limit: 3,
            });;
            if(products.data.length > 0) {
                for (const element in products.data) {
                    await Product.create({
                        pid: products.data[element].id,
                        name: products.data[element].name
                    });
                }
            }
            const prices = await stripe.prices.list({
                limit: 3,
            });
            if(prices.data.length > 0) {
                for (const element in prices.data) {
                    let amount = prices.data[element].unit_amount/100;
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
            console.log("Database populated successfully");
        } catch(e) {
            console.log("Error while populaiton database");
            console.log(e);
        }

    }

};