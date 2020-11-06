const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/Subscription');
const User = require("../models/User");
const Price = require("../models/Price");
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');

const { validationResult } = require('express-validator');

module.exports = {
    async createProduct(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.send( 
                    {
                        data:{
                            error: errors.array()[0].msg
                        } 
                    });
            }
            let unit_amount = req.body.unit_amount * 100;
            const product = await stripe.products.create({
                name: req.body.name
            });
            const pro = await Product.create({
                pid: product.id,
                name: product.name,
                active: product.active
            });
            const price = await stripe.prices.create({
                unit_amount: unit_amount,
                currency: 'usd',
                recurring: {interval: req.body.interval, interval_count: req.body.interval_count},
                product: product.id,
                billing_scheme: 'per_unit'
            });
            const p = await Price.create({
                pid: price.id,
                currency: price.currency,
                interval: price.recurring.interval,
                amount: price.unit_amount/100,
                productPid: price.product
            },
            { fields: ["pid", "currency", "interval", "amount", "productPid"] }   
            );

            res.send({
                data: {
                    product: pro,
                    price: p
                }
            }); 
        }
        catch(e) {
            console.log(e);
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    },
    async updateProduct(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.send( 
                    {
                        data:{
                            error: errors.array()[0].msg
                        } 
                    });
            }
            // if(req.body.unit_amount) req.body.unit_amount *= 100;
            const editObj = {
                ...(typeof req.body.name !== "undefined" && {name: req.body.name}),
                ...(typeof req.body.active !== "undefined" && {active: req.body.active})
                }
            if(req.body.name, req.body.product_id) {
                await stripe.products.update(
                    req.body.product_id,
                    editObj
                  );
                var pro = await Product.findOne({
                    where: {pid: req.body.product_id}
                });
    
                if(pro) {
                    await pro.update({
                        name: req.body.name,
                        active: req.body.active
                      }); 
                }     
            }

            // if(req.body.price_id) {
            //     console.log(typeof req.body.unit_amount);
            //     console.log(typeof req.body.interval);
            //     const editObj = {
            //         ...(typeof req.body.unit_amount !== "undefined" && {"unit_amount_decimal": req.body.unit_amount}),
            //         ...(typeof req.body.interval !== "undefined" && {recurring: {interval: req.body.interval, ...(typeof req.body.interval_count !== "undefined" && {interval_count: req.body.interval_count})}})
            //     }
            //     console.log(editObj);
            //     await stripe.prices.update(
            //         req.body.price_id,
            //         {unit_amount: 800}
            //     );
            //     var p = await Price.findOne({
            //         where: {pid: req.body.price_id}
            //     });
            //     if(p) {
            //         const editObj2 = {
            //             ...(typeof req.body.unit_amount !== "undefined" && {amount: req.body.unit_amount/100}),
            //         ...(typeof req.body.interval !== "undefined" && {interval: req.body.interval})
            //         }
            //         await p.update(editObj2);
            //     }
            // }

            res.send({
                data: {
                    product: pro,
                    // price: p
                }
            }); 
        }
        catch(e) {
            console.log(e);
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    },
    async getPrices(req, res, next ) {
        try {
            let prices = await Product.findAll({where: {active: true}, include:[Price]});
            if(prices.length > 0) {
                res.send({
                    data: {
                       prices,
                       key: process.env.STRIPE_PUBLIC_KEY
                    }
                })
            } else {
                res.send({
                    data: {
                        error: "No prices are set yet!"
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
    },
    async listAllProducts(req, res, next ) {
        // do not use me to get product but the above one
        try {
            const products = await stripe.products.list({
                limit: 3,
            });

            res.send({
                data: {
                    products
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
    async createCustomer(req, res, next) {
        try {
            const customer = await stripe.customers.create({
                email: req.body.email,
            });
            
              // save the customer.id as stripeCustomerId

            const user = await User.findOne({
                where: {email: req.body.email}
            });

            if(user) {
                await user.update({
                    stripeId: customer.id
                  });
                  res.send({
                    data: {
                        customer
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
    },
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
                    // const subscription = await stripe.subscriptions.retrieve(sub.dataValues.subscription_id);
                    return res.send({
                        data: {
                            subscription: sub.dataValues
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
    async updateAutoChargeSubscription(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.send( 
                    {
                        data:{
                            error: errors.array()[0].msg
                        } 
                    });
            }
            const sub = await req.user.getSubscription();
            if(sub) {
                if(sub.dataValues) {
                    await stripe.subscriptions.update(sub.dataValues.subscription_id, {cancel_at_period_end: !req.body.charge});                   
                    
                    await sub.update({
                        autoCharge: req.body.charge
                    });

                    return res.send({
                        data: {
                            subscription: sub,
                            msg: "Auto Payment Status updated Successfully!"
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
    async createSubscription(req, res, next) {
        try {
            await stripe.customers.update(
                req.user.stripeId,
                {
                    source: req.body.token.id 
                }
                );

                // Create the subscription
                const subscription = await stripe.subscriptions.create({
                    customer: req.user.stripeId,
                    items: [{ price: req.body.id }]
                });
                console.log(subscription);
                await req.user.createSubscription({
                    amount: subscription.plan.amount/100,
                    subscription_id: subscription.id,
                    status: subscription.status,
                    start: subscription.current_period_start,
                    end: subscription.current_period_end,
                    interval: `${subscription.plan.interval_count} ${subscription.plan.interval}`  
                });

                // Create the invoice
                await req.user.createInvoice({
                    total: subscription.plan.amount/100,
                    invoiceId: subscription.latest_invoice,
                    productPid: subscription.plan.product,
                    issueDate: subscription.created
                });


                res.send({
                    data: {
                        subscription
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
    async getInvoices(req, res, next) {
        try {
        //    const invoices = await Invoice.findAll({
        //        where: {
        //            user_id: req.user.id
        //        },
        //        raw: true,
        //        nest: true 
        //    });
           const invoices = await req.user.getInvoices({raw: true, nest: true, include:[Product]});
           if(invoices.length > 0) {
            res.send({
                data: {
                    invoices
                }
            });
           } else {
                res.send({
                    data: {
                        msg: "No invoices found"
                    }
                }); 
           }
           
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