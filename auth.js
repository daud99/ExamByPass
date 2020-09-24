const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const SessionConfig = require("./config/session");

module.exports = new class {

    initialize(app) {
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(cookieParser(SessionConfig.secret));

    

    }

}
