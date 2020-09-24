const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const SessionConfig = require("./config/session");

module.exports = new class {

    initialize(app) {
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(cookieParser(SessionConfig.secret));

      // CORS setup
        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization, userId, userType, tokenId"
            );
            res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PATCH, PUT, DELETE, OPTIONS"
            );
            if(req.method === 'OPTIONS') {
                return res.sendStatus(200);
            }
            next();
        });


    }

}
