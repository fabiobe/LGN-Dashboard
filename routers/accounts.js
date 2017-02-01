/**
 * Created by fabio on 11.12.2016.
 */
let express = require('express');
let router = express.Router();
let mysql = require('mysql');
let path = require('path');
let Hashmap = require('hashmap');
let authenticatedUsers = new Hashmap();
let users = require('./api.js').users;
let mysql_config = require('./../config/mysql.json');
let pool = mysql.createPool(mysql_config);
let fs = require('fs');

console.log("\x1b[36m[Debug] [ACCOUNTS] starting...");

let change = "";

fs.readFile(path.join(__dirname, '../views/accounts/change.html'), 'utf8', function (err, data) {
    if (err) throw err;
    change = data;
});

router.get('/id/:id', (req, res) => {

    res.sendFile(path.join(__dirname, '../views/accounts/user.html'));

});

router.get('/change/password/token/:token', (req, res) => {

    pool.getConnection((err, connection) => {

        connection.query("SELECT * FROM activation WHERE token='" + req.params.token + "'", (err, rows) => {

            if (rows.length > 0) {
                let row = rows[0];
                let email = row.email;
                let id = "0";
                let firstname = "";
                let lastname = "";

                connection.query("SELECT * FROM accounts WHERE email='" + email + "'", (err, rows) => {

                    firstname = rows[0].firstname;
                    lastname = rows[0].lastname;
                    id = rows[0].id;

                    console.log(rows[0]);

                });

                console.log(email + " " + id);

                let html = change.replace("CHANGETHIS", id);

                res.send(html);
            }

        });

        connection.release();

    });

});

module.exports = router;