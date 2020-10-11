const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/Subscription');
const User = require("../models/User");

module.exports = {

    async createCheckoutSession(req, res, next) {
        try {
            const type = req.body.type;
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                  {
                    // Replace `price_...` with the actual price ID for your subscription
                    // you created in step 2 of this guide.
                    price: process.env[type],
                    quantity: 1,
                  },
                ],
                mode: 'subscription',
                success_url: 'http://localhost:3000/account',
                cancel_url: 'http://localhost:3000/login',
                customer_email: req.user.email
              });
              

              res.send({
                    data: {
                        id: session.id,
                        key: process.env.STRIPE_PUBLIC_KEY
                    }
                })
        }
        catch(e) {
            console.log(e);
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    },

    async getSubscription(req, res, next) {
        try {
            const sub = await req.user.getSubscription();
            if(sub) {
                if(sub.dataValues) {
                    const subscription = await stripe.subscriptions.retrieve(sub.dataValues.subscription_id);
                    return res.send({
                        data: {
                            subscription: subscription
                        }
                    })
                }
            } 
                res.send({
                    data: {
                        msg: "You do not have a subscription"
                    }
                })
        }
        catch(e) {
            console.log(e);
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    },


    async webHook(req, res, next) {
        try {
            const payload = req.body;

            const sig = req.headers['stripe-signature'];

            let event;

            try {
                event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
            } catch (err) {
                console.log("error for the event in webhook");
                console.log(err);
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }
          
            switch (event.type) {
                case 'checkout.session.completed': {
                  const session = event.data.object;
            
                    let user = await User.findOne({
                        where: {email: session.customer_email}
                        });
                    if(user) {
                        if(!await user.getSubscription()) {
                            await user.createSubscription({
                                amount: session.amount_total/100,
                                subscription_id: session.subscription,
                                status: "paid"
                            });
                        } else {
                            let sub = await Subscription.findOne({
                                where: {user_id: user.id}
                            });
                            await sub.update({
                                amount: session.amount_total/100,
                                subscription_id: session.subscription ,
                                status: "paid"
                            });
                        }
                        
                        
                    }

                  break;
                }

                case 'invoice.paid': {
                    const invoice = event.data.object;
                    const subscriptionId = invoice.subscription;
              
                    const subscription = await Subscription.findOne({
                        where: {subscription_id: subscriptionId}
                    });
              
                    // Check if this is the first invoice or a later invoice in the
                    // subscription lifecycle.
                    const firstInvoice = invoice.billing_reason === 'subscription_create';
              
                    // You already handle marking the first invoice as paid in the
                    // `checkout.session.completed` handler.
                    //
                    // Only use this for the 2nd invoice and later, so it doesn't conflict.
                    if (!firstInvoice) {
                        await subscription.update({
                            status: "paid"
                        });
                    }
              
                    break;
                }

                case 'invoice.payment_failed': {
                    const invoice = event.data.object;
                    const subscriptionId = invoice.subscription;
                
                    const subscription = await Subscription.findOne({
                        where: {subscription_id: subscriptionId}
                    });
                    await subscription.update({
                        status: "unpaid"
                    });
                
                    break;
                }

              }

              
            res.status(200);
            

            //   res.send({
            //         data: {
            //             id: session.id,
            //             key: process.env.STRIPE_PUBLIC_KEY
            //         }
            //     })
        }
        catch(e) {
            console.log(e);
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    }

};