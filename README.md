# ExamByPass

For Bahaa and Khaleed.

## Production

## 1. Install Node (v10 stable) via nvm

https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-a-centos-7-server


Set the default node version to the one installed.

```sh
nvm alias default v10.x.x
```

## 2. Install MySQL

https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-8

## 3. Install Git and Pull Code

```sh
yum install git
```

Clone the repository

```sh
git clone https://github.com/daud99/ExamByPass.git
```

(The repo might be somewhere else as well)

Code will be downloaded to:

```sh
/var/ExamByPass
```

## 4. Open Port 80

```sh
sudo firewall-cmd --add-service=http --permanent
```

```sh
sudo firewall-cmd --reload
```

## 5. Configure Project

Pull and update dependencies

```sh
cd server
```

```sh
npm install
```

```sh
cd ..
```

```sh
cd client
```

```sh
npm install
```

Compile webpack/GUI front end for production

```sh
npm install
```
```sh
npm run build
```

> This will store the minified front end in the server/public folder and you will not be needing the client folder anymore.
## 6. Configure Project

### 6a. Change default configuration

Navigate to `/config` directory.

```sh
cd config
```

Change site URL

`nano site.js` or `vi site.js`

Change the URL to the public URL, and save the file.

> NOTE: The config may get replaced when `git pull` is applied. It happens when the updated code is related to configuration.

There are a lot of other configuration files such as stripe, parser, and smtp. Depending on the situation, they may need updates.

Place your production keys respectively by generating them from the facebook and google developer console respectively in the **keys.js** file.

Change the parser URL in the parser.js file respectively

DB configuration will be placed in db.js file

## 7. Starting server on system startup

Install PM2

```sh
npm install pm2@latest -g
```

Start the process in background

```sh
pm2 start app.js (make sure youre in the code directory)
```

Register process on startup

```sh
pm2 startup systemd
```

## 9. Testing

Navigate to `http://<your-url>/` and test out the following basic features:

1. Login and session maintainance
2. Database store/retreive (Try users section)
3. Parser connection (Try agents, groups section)
4. Email sending (Try forgot password feature)


## 10. Updating code (Optional - Laters)

The code can be updated to the git repository master branch. Whenever the update needs to be reflected to the production server.

1. Perform a `git pull` on the code directory
2. In case there's a conflict or update in `git pull`, try: https://stackoverflow.com/a/2798934/673606
2a. In case of a hard reset, make sure you reconfigure the SocDash
3. Perform `npm install` incase a new package was added
4. Perform `npm run build` if the UI was changed
5. Restart the process: `pm2 restart app.js`


## For development

### Running the server
```sh
cd server
```
```sh
npm install
```
```sh
npm start
```

### Running the vue app for development
```sh
cd client
```
```sh
npm install
```
```sh
npm start
```

> By above way we will be able to test both node and vue running on single port 3000

### Running the vue app for production
```sh
cd client
```
```sh
npm install
```
```sh
npm run build
```
