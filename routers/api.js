/**
 * Created by fabio on 20.11.2016.
 */
let express = require('express');
let router = express.Router();
let path = require('path');
let mysql = require("mysql");
let crypto = require('crypto');
let Hashmap = require('hashmap');
let users = [];
let authenticatedUsers = new Hashmap();
let io = require('./../server.js').io;

let connection = mysql.createConnection({
    "host": "localhost",
    "user": "netzwerkag",
    "password": "lgnIT2014!",
    "database": "netzwerkag"
});

console.log("\x1b[36m[Debug] [API] starting...");

connection.connect(function (err) {
    if (err) {
        console.error('[Error] [MySQL] Error while connecting: ' + err);
        return;
    }
    console.log('\x1b[32m[Info] [MySQL] Connection established');
});
connection.query("CREATE TABLE IF NOT EXISTS dashboard_users (id INT(255) NOT NULL AUTO_INCREMENT PRIMARY KEY, firstname VARCHAR(255), lastname VARCHAR(255), email VARCHAR(255), password VARCHAR(255))");

router.get('/login', (req, res) => {

    res.sendFile(path.join(__dirname, '../views/api/login.html'));

});

router.post('/login', (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    let hash = crypto.createHmac('sha512', 'lgnIT2014!');
    hash.update(password);
    let value = hash.digest('Hex');


    connection.query("SELECT * FROM dashboard_users WHERE email='" + email + "' LIMIT 1", (err, rows) => {

        if (err) {
            res.redirect('/');
        }
        if (rows.length > 0) {
            if (value == rows[0].password) {
                let token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
                res.cookie('token', token);
                users.push(token);
                console.log('\x1b[32m[Info] [Users] ' + rows[0].firstname + ' ' + rows[0].lastname + ' has logged in!');
                res.redirect('/');
            } else {
                res.redirect('/');
            }
        } else {
            res.sendFile(path.join(__dirname + '/../views/api/login-failed.html'));
        }

    });


});

router.post('/mail', (res, req) => {


});

module.exports = router;
module.exports.users = users;