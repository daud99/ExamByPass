require("dotenv").config();
const express = require("express");
const app = express();
let ejs = require("ejs");
const auth = require("./auth.js");
const siteConfig = require("./config/site.js");
const routes = require("./server-routes.js");
const db = require("./config/db.js");
var bodyParser = require('body-parser');

async function ignite() {
  try {
    if (!process.env.MSG) {
      throw new Error("\nEnvironment variables are not working.\n");
    }

    db.authenticate().then(() => console.log("connectedd"));

    auth.initialize(app);
    app.use(bodyParser.json({limit: "10000mb",extended:true}));
    app.use(bodyParser.urlencoded({limit: "10000mb", extended: true, parameterLimit:50000000}));
    app.use("/", routes);

    // Handle production
    if (process.env.NODE_ENV === "development") {
      //static folder
      app.use(express.static(__dirname + "/public"));

      // handle SPA (Single Page Application)
      app.get(/.*/, (req, res) => {
        res.sendFile(__dirname + "/public/index.html");
      });
    }

    app.listen(siteConfig.port, () => {
      console.log(
        `ExamByPass server is running on ${
          process.env.PORT || siteConfig.port
        }!`
      );
    });
  } catch (e) {
    console.log("FATAL IGNITION ERROR", "\n", e);
  }
}

ignite();
