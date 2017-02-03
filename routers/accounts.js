/**
 * Created by fabio on 11.12.2016.
 */
let express = require('express');
let router = express.Router();
let mysql = require('mysql');
let path = require('path');
let crypto = require('crypto');
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

let choose = "";

fs.readFile(path.join(__dirname, '../views/accounts/choose.html'), 'utf8', function (err, data) {
    if (err) throw err;
    choose = data;
});

router.get('/id/:id', (req, res) => {

    res.sendFile(path.join(__dirname, '../views/accounts/user.html'));

});

router.get('/add', (req, res) => {

    res.sendFile(path.join(__dirname, '../views/accounts/add.html'));

});

router.get('/activate/token/:token', (req, res) => {

    pool.getConnection((err, connection) => {
        connection.query("SELECT * FROM activate WHERE token='" + req.params.token + "'", (err, rows) => {
            if (rows.length > 0) {
                let row = rows[0];
                let firstname = row.firstname;
                let lastname = row.lastname;
                let email = row.email;

                let html = choose.replace("CHANGETHISTOO", firstname + " " + lastname);
                html = html.replace("CHANGETHIS", email + "");

                res.send(html);
            } else{
                res.sendFile(path.join(__dirname, '../views/accounts/choose_error.html'));
            }
        });
    });

});

router.post('/proceed/activate', (req, res) => {

    let token = req.body.user;
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;

    if (password != confirmpassword) {
        res.sendFile(path.join(__dirname, '../views/accounts/choose_error_password.html'));
    } else {

        let hash = crypto.createHmac('md5', '');
        hash.update(password);
        let value = hash.digest('hex');
        res.send(value);

        //TODO ADD PASSWORD CHANGE MECHANISM


    }

});

router.post('/proceed/change/password', (req, res) => {

    let user = req.body.user;
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;

    if (password != confirmpassword) {
        res.sendFile(path.join(__dirname, '../views/accounts/change_error_password.html'));
    } else {

        //TODO ADD PASSWORD CHANGE MECHANISM

    }


});

router.get('/password/reset', (req, res) => {

    res.sendFile(path.join(__dirname, '../views/accounts/forget.html'));

});

router.get('/change/password/token/:token', (req, res) => {

    pool.getConnection((err, connection) => {

        connection.query("SELECT * FROM activation WHERE token='" + req.params.token + "'", (err, rows) => {

            if (rows.length > 0) {
                let row = rows[0];
                let email = row.email;

                connection.query("SELECT * FROM accounts WHERE email='" + email + "'", (err, rows) => {

                    let firstname = rows[0].firstname;
                    let lastname = rows[0].lastname;
                    let user = rows[0].id;


                    let html = change.replace("CHANGETHISTOO", firstname + " " + lastname);
                    html = html.replace("CHANGETHIS", user + "");

                    res.send(html);

                });


            } else {
                res.sendFile(path.join(__dirname, '../views/accounts/change_error.html'));
            }

        });

        connection.release();

    });

});

module.exports = router;