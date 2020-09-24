const express = require('express')
const app = express()
let ejs = require('ejs');

const auth = require("./auth.js");
const siteConfig = require('./config/site.js');
const routes = require('./server-routes.js');

async function ignite() {

    try {

        auth.initialize(app);


        app.use('/', routes);

        // Handle production
        if(process.env.NODE_ENV === 'production') {
          //static folder
          app.use(express.static(__dirname + '/public'));

          // handle SPA (Single Page Application)
          app.get(/.*/, (req,res) => {
            res.sendFile(__dirname + '/public/index.html');
          })
        }
        app.listen(siteConfig.port, () => {
            console.log(`SocDash active at ${siteConfig.port}!`);
        });

    } catch (e) {
        console.log("FATAL IGNITION ERROR");
        console.log(e);
    }

}

ignite();
