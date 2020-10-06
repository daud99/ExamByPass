const bcrypt = require("bcrypt");
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GitHubStrategy = require('passport-github').Strategy

const session = require('express-session')
// initalize sequelize with session store
var SequelizeStore = require("connect-session-sequelize")(session.Store)

const User = require("./models/User")

const Keys = require("./config/Keys")
const Db = require("./config/db")


module.exports = new class {

    initialize(app) {
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(cookieParser(Keys.secret));
      
      app.use(cors());

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
      
      // app.use({

      // })

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
      function(accessToken, refreshToken, profile, done) {
        console.log("profile for github");
        console.log(profile);
        if(profile._json.email === null) {
          done(null, false, { message: 'Email address is required in order to login but your github email address is private.' })
        }
        User.findAll({where: {email: profile._json.email}})
        .then(user => {
          if(user.length > 0) {
            done(null, user[0]);
          } else {
            User.create({
              email: profile._json.email,
              emailVerified: profile._json.email_verified,
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
        profileFields: ['id', 'displayName', 'email']
      },
      (accessToken, refreshToken, profile, done) => {
        // Handle facebook login
        User.findAll({where: {email: profile._json.email}})
          .then(user => {
            if(user.length > 0) {
              done(null, user[0]);
            } else {
              User.create({
                email: profile._json.email,
                emailVerified: profile._json.email_verified,
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
      }));

      // Google OAuth

      passport.use(
        new GoogleStrategy({
          clientID: Keys.google.client_id,
          clientSecret: Keys.google.client_secret,
          callbackURL: '/login/google/return'
        }, (accessToken, refreshToken, profile, done) => {
          User.findAll({where: {email: profile._json.email}})
          .then(user => {
            if(user.length > 0) {
              done(null, user[0]);
            } else {
              User.create({
                email: profile._json.email,
                emailVerified: profile._json.email_verified,
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


}
