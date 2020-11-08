const Subscription = require("../models/Subscription")

module.exports = new class {
    async getSubscriptionStatus(req, res, next) {
       try {
        const subscription = await req.user.getSubscription();
        if(subscription) {
            res.send({
                data: {
                    subscription_status: subscription.dataValues? subscription.dataValues.status : "not_subscribed"
                }
            })
        } else {
            res.send({
                data: {
                    subscription_status: "not_subscribed"
                }
            })
        }
       }
       catch(e) {
            console.log(e);
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
       }
    }
    async getAllSubscriptions(req,res, next) {
        try {
            const subscriptions = await Subscription.findAll({ include:[{all:true}]});
            res.send({
                data: {
                    subscriptions
                }
            })
        }
        catch(e) {
            console.log(e)
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    }
};