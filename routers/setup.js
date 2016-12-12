/**
 * Created by fabio on 21.11.2016.
 */
let express = require('express');
let router = express.Router();
let path = require('path');
let mysql = require("mysql");
let crypto = require('crypto');
var mysql_config = require('./../config/mysql.json');

let connection = mysql.createConnection(mysql_config);

console.log("\x1b[36m[Debug] [SETUP] starting...");

connection.connect(function (err) {
    if (err) {
        console.error('\x1b[91m[Error] [MySQL] Error while connecting: ' + err);
        return;
    }
    console.log('\x1b[32m[Info] [MySQL] Connection established');
});
connection.query("CREATE TABLE IF NOT EXISTS dashboard_users (id INT(255) NOT NULL AUTO_INCREMENT PRIMARY KEY, firstname VARCHAR(255), lastname VARCHAR(255), email VARCHAR(255), password VARCHAR(255))");

router.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, '../views/setup/setup.html'));

});

router.get('/createadmin', (req, res) => {
    res.redirect('/');
});

router.post('/createadmin', (req, res) => {

    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let password = req.body.password;

    let hash = crypto.createHmac('sha512', 'lgnIT2014!');
    hash.update(password);
    let value = hash.digest('Hex');

    connection.query("INSERT INTO dashboard_users (firstname, lastname, email, password) VALUES ('" + firstname + "', '" + lastname + "', '" + email + "', '" + value + "')");
    res.sendFile(path.join(__dirname, '../views/setup/success.html'));
    setTimeout(() => {
        process.exit();
    }, 200);


});

module.exports = router;