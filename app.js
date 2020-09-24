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

        app.listen(siteConfig.port, () => {
            console.log(`SocDash active at ${siteConfig.port}!`);
        });

    } catch (e) {
        console.log("FATAL IGNITION ERROR");
        console.log(e);
    }

}

ignite();
