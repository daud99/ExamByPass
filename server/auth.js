const User = require("./models/User")
const Comment = require("./models/Comment")
const Discount = require("./models/Discount")
const discountApplicable = require("./models/discountApplicable")
const Invoice = require("./models/Invoice")
const Subscription = require("./models/Subscription")
const Ticket = require("./models/Ticket")
const Session = require("./models/Session")
const answerArea = require("./models/answerArea")
const examLibrary = require('./models/examLibrary')
const Question = require('./models/Question')
const structureEntry = require('./models/structureEntry')
const resetPasswordRequest = require('./models/resetPasswordRequest')
const structureEntryQuestionLink = require('./models/structureEntryQuestionLink')
const Testlet = require('./models/Testlet')
const Answer = require('./models/Answer')
const Product = require('./models/Product')
const Price = require('./models/Price')
const Coupon = require('./models/Coupon')
const promotionCode = require('./models/promotionCode')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


var ejs = require('ejs')
var nodemailer = require("nodemailer")
const fs = require('fs')
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GitHubStrategy = require('passport-github').Strategy
const { Op } = require("sequelize")


const session = require('express-session')
// initalize sequelize with session store
var SequelizeStore = require("connect-session-sequelize")(session.Store)

// const User = require("./models/User")

const Keys = require("./config/Keys")
const EmailConfig = require("./config/email")
const SiteConfig = require("./config/site")
const Db = require("./config/db")
const Misc = require("./misc")



module.exports = new class {

    initialize(app) {
      app.use("/api/*", bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(cookieParser(Keys.secret));
      
      app.use(cors());

      // db thing


      User.hasMany(Session,{onDelete: 'CASCADE'})
      User.hasMany(Invoice,{onDelete: 'CASCADE'})
      User.hasMany(discountApplicable,{onDelete: 'CASCADE'})
      User.hasMany(Discount,{onDelete: 'CASCADE'})
      User.hasMany(Ticket,{onDelete: 'CASCADE'})
      User.hasMany(examLibrary,{onDelete: 'CASCADE'})
      User.hasMany(resetPasswordRequest,{onDelete: 'CASCADE'})
      User.hasMany(Invoice,{onDelete: 'CASCADE'})
      User.hasMany(Coupon,{onDelete: 'CASCADE'})
      User.hasOne(Subscription,{onDelete: 'CASCADE'})
      Product.hasOne(Price, { foreignKey: 'productPid' },{onDelete: 'CASCADE'})
      Product.hasMany(Invoice, { foreignKey: 'productPid' },{onDelete: 'CASCADE'})
      Invoice.belongsTo(Product,{onDelete: 'CASCADE'})
      Subscription.belongsTo(User,{onDelete: 'CASCADE'})
      examLibrary.hasMany(Question,{onDelete: 'CASCADE'})
      examLibrary.hasMany(structureEntry,{onDelete: 'CASCADE'})
      examLibrary.hasMany(structureEntryQuestionLink,{onDelete: 'CASCADE'})
      examLibrary.hasMany(Testlet,{onDelete: 'CASCADE'})
      Coupon.hasMany(promotionCode,{onDelete: 'CASCADE'})
      Question.hasMany(Answer,{onDelete: 'CASCADE'})
      Question.hasMany(structureEntryQuestionLink,{onDelete: 'CASCADE'})
      structureEntry.hasMany(structureEntryQuestionLink,{onDelete: 'CASCADE'})
      Testlet.hasMany(Question,{onDelete: 'CASCADE'})
      Ticket.hasMany(Comment,{onDelete: 'CASCADE'})
      Answer.hasMany(answerArea,{onDelete: 'CASCADE'})




      function extendDefaultFields(defaults, session) {
         let r = {
          data: defaults.data,
          expires: defaults.expires
        };
         if(session.passport) {
           if(session.passport.user) {
            r.userId = session.passport.user;
           }
         }
        
          return r;
        }
  
        var myStore = new SequelizeStore({
          db: Db,
          table: "Session",
          extendDefaultFields: extendDefaultFields,
          checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
          expiration: 24 * 60 * 60 * 1000  // The maximum age (in milliseconds) of a valid session.
        });

       // configuring session
       app.use(
        session({
          secret: Keys.secret,
          store: myStore,
          resave: false, // we support the touch method so per the express-session docs this should be set to false
          proxy: false, // if you do SSL outside of node.
          saveUninitialized: false,
          cookie: {
            secure: false,
            maxAge: 2.16e+7, // 10 hours
        }
        })
      );  
      
      app.use(passport.initialize());
      app.use(passport.session());

      // passport

      /*
      Stores information in cookie when user is created
      */
      passport.serializeUser(function(user, cb) {
        cb(null, user.id);
      });

      /*
      Extract information from cookie when logged in user sends the request
      */
      passport.deserializeUser(function(id, done) {
        User.findByPk(id)
        .then(user => {
          if(user) {
            done(null, user);
          } else {
            done(null, null);
          }
        })
        .catch(err=>{
          done(null, null);
        })

      });

      // GitHub OAuth
      passport.use(new GitHubStrategy({
        clientID: Keys.github.client_id,
        clientSecret: Keys.github.client_secret,
        callbackURL: "/login/github/return"
      },
      async function(accessToken, refreshToken, profile, done) {
        if(profile._json.email === null) {
          done(null, false, { message: 'Email address is required in order to login but your github email address is private.' })
        }
        User.findAll({where: {email: profile._json.email}})
        .then(async user => {
          if(user.length > 0) {
            done(null, user[0]);
          } else {
            const customer = await stripe.customers.create({
                email: profile._json.email,
            });
            User.create({
              email: profile._json.email,
              emailVerified: profile._json.email_verified,
              stripeId: customer.id,
              roles: 'user'
            })
            .then(result=> {
              done(null, result);
            })
            .catch(err => {
              console.log("err");
              console.log(err);
            })
          }
        }) 
      }
    ));

      // Facebook OAuth
      passport.use(new FacebookStrategy({
        clientID: Keys.facebook.app_id,
        clientSecret: Keys.facebook.apps_secret,
        callbackURL: '/login/facebook/return',
        profileFields: ['id', 'displayName', 'email', 'name']
      },
      async (accessToken, refreshToken, profile, done) => {
        // Handle facebook login
        User.findAll({where: {email: profile._json.email}})
          .then(async user => {
            if(user.length > 0) {
              done(null, user[0]);
            } else {
              const customer = await stripe.customers.create({
                email: profile._json.email,
              });
              User.create({
                email: profile._json.email,
                firstName: profile._json.first_name,
                lastName: profile._json.last_name,
                stripeId: customer.id,
                roles: 'user'
              })
              .then(result=> {
                module.exports.sendVerificationEmail(profile._json.email);
                done(null, result);
              })
              .catch(err => {
                console.log("err");
                console.log(err);
              })
            }
          }) 
      }));

      // Google OAuth

      passport.use(
        new GoogleStrategy({
          clientID: Keys.google.client_id,
          clientSecret: Keys.google.client_secret,
          callbackURL: '/login/google/return'
        }, async (accessToken, refreshToken, profile, done) => {
          User.findAll({where: {email: profile._json.email}})
          .then(async user => {
            if(user.length > 0) {
              done(null, user[0]);
            } else {
              const customer = await stripe.customers.create({
                email: profile._json.email,
              });
              User.create({
                email: profile._json.email,
                emailVerified: profile._json.email_verified,
                firstName: profile._json.given_name,
                lastName: profile._json.family_name,
                stripeId: customer.id,
                roles: 'user'
              })
              .then(result=> {
                done(null, result);
              })
              .catch(err => {
                console.log("err");
                console.log(err);
              })
            }
          }) 
          
        })
      );

      // local Strategy
      passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      }, async function(email, password, done) {

          var user = await User.findOne({
             where: {email: email},
          });

          if (!user) {
              return done(null, false, { message: 'Incorrect email address or password.' });
          }
       
          const dbPassword = user.dataValues.password;
          if(!dbPassword) {
            return done(null, false, { message: 'Incorrect email address or password.' });
          }
          if (!await bcrypt.compare(password, dbPassword)) {
              return done(null, false, { message: 'Incorrect email address or password.' });
          }
          
          return done(null, user.dataValues);

      })); 
 
    }

    isAuthenticated(req,res,next){
      if(req.isAuthenticated()){
          next();
      } else {
          res.redirect("/login");
      }
    }

    isNotAuthenticated(req,res,next){
        if(!req.isAuthenticated()){
            next();
        } else{
            res.redirect("/dashboard");
        }
    }

    isAuthenticatedAndAdmmin(req,res,next) {
      if(req.isAuthenticated() && req.user.roles === 'admin') {
        next(); 
      } else{
        res.redirect("/login");
      }
    }

    async isSubscribed(req,res,next) {
      const subscription = await req.user.getSubscription();
      if(subscription) {
        if(req.isAuthenticated() && subscription.status === 'active'){
          next();
      } else {
          res.status(400).send({
            error: 400,
            message: "You are not subscribed.",
          });
        }
      } else {
          res.status(400).send({
            error: 400,
            message: "You are not subscribed.",
          });
        }
    }

    async isUnSubscribed(req,res,next) {
      const subscription = await req.user.getSubscription();
      if(subscription) {
        if(req.isAuthenticated() && subscription.status !== 'active'){
          next();
      } else {
          res.status(400).send({
            error: 400,
            message: "You are subscribed.",
          });
        }
      } else {
        next();
      }
    }

    async hashPassword(password) {
      return await bcrypt.hash(password, 10);
    }

    tryLogin(req, email, password) {
      return new Promise((resolve, reject) => {
          passport.authenticate('local', (err, user) => {

              if (err) { resolve(false); }
              if (!user) { resolve(false); }

              req.login(user, () => {
                  return resolve(user);
              });
          })({ body: { email, password } });

        });
    }

    async sendRecoveryEmail(email) {
          
      var user = await User.findOne({
        where: {email: email},
      });

      if(!user) {
          return false;
      }

      var token = Misc.makeID(32);
      
      await user.update({
        resetPasswordToken: token,
        resetPasswordExpire: Date.now() + 3600000 // 1 hour
      });

      var template = fs.readFileSync("emails/notification.htm", 'utf-8');

      var emailHTML = ejs.render(template, {
        siteURL: `${SiteConfig.url}:${SiteConfig.port}/reset-password?token=${user.resetPasswordToken}`,
        action: 'To reset the password, click the following link:',
        btnText: 'Reset Password',
        message: 'If you do not requested the password change,you can ignore and delete this email'
    });

      try {
      
          let transporter = nodemailer.createTransport({
              host: EmailConfig.host,
              port: EmailConfig.port,
              secure: EmailConfig.secure,
              auth: {
                  user: EmailConfig.username,
                  pass: EmailConfig.password
              }
          });
          
          // send mail with defined transport object
          let info = await transporter.sendMail({
              to: user.email, // list of receivers
              subject: "Password Recovery", // Subject line
              html: emailHTML // html body
          });

          return info.accepted.length > 0;

      } catch(e) {

          return false;

      }

    }

    async sendVerificationEmail(email) {
          
      var user = await User.findOne({
        where: {email: email},
      });

      if(!user) {
          return false;
      }

      var token = Misc.makeID(32);
      
      await user.update({
        verificationToken: token
      });

      var template = fs.readFileSync("emails/notification.htm", 'utf-8');

      var emailHTML = ejs.render(template, {
        siteURL: `${SiteConfig.url}:${SiteConfig.port}/verify-password/${user.verificationToken}`,
        action: 'To verify account, click the following link:',
        btnText: 'Account Verification',
        message: 'If you do not signed up on our site,you can ignore and delete this email.'
    });

      try {
      
          let transporter = nodemailer.createTransport({
              host: EmailConfig.host,
              port: EmailConfig.port,
              secure: EmailConfig.secure,
              auth: {
                  user: EmailConfig.username,
                  pass: EmailConfig.password
              }
          });
          
          // send mail with defined transport object
          let info = await transporter.sendMail({
              to: user.email, // list of receivers
              subject: "Email Verification", // Subject line
              html: emailHTML // html body
          });

          return info.accepted.length > 0;

      } catch(e) {

          return false;

      }

    }

    async updateRecoverPassword(newPassword, token) {

        if(!token) {
            throw "Token required for recovery.";
        }
        var user = await User.findOne({
          where: {resetPasswordToken: token, resetPasswordExpire: {
            [Op.gt]: Date.now()
          }},
        });
        
        if(!user) {
            return false;
        }

        await user.update({
          password: await this.hashPassword(newPassword),
          resetPasswordToken: undefined,
          resetPasswordExpire: undefined // 1 hour
        });

        return true;
    }

    async changePassword(email, newPassword, oldPassword) {

      var user = await User.findOne({
        where: {email: email}
      });
      
      if(!user || !await bcrypt.compare(oldPassword, user.dataValues.password)) {
          return false;
      }

      await user.update({
        password: await this.hashPassword(newPassword)
      });

      return true;
    }


}
