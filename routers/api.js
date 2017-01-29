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
let mysql_config = require('./../config/mysql.json');

let pool = mysql.createPool(mysql_config);

console.log("\x1b[36m[Debug] [API] starting...");

pool.getConnection((err, connection) => {
    connection.query("CREATE TABLE IF NOT EXISTS dashboard_users (id INT(255) NOT NULL AUTO_INCREMENT PRIMARY KEY, firstname VARCHAR(255), lastname VARCHAR(255), email VARCHAR(255), password VARCHAR(255))");
    connection.release();
});

router.get('/login', (req, res) => {

    let maintenance = true;

    pool.getConnection((err, connection) => {
        connection.query("SELECT value FROM status WHERE type='Maintenance'", (err, rows) => {

            if (rows.length > 0) {
                if (rows[0] == "false") {
                    maintenance = false;
                }
            }
        });

        connection.release();
    });

    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/dashboard.html'));
            return;
        }
    }
    if (maintenance == false) {
        res.sendFile(path.join(__dirname, '../views/api/login.html'));
    } else {
        res.sendFile(path.join(__dirname, '../views/default/maintenance-login.html'));
    }

});

router.get('/wifi-users/json/callback/list', (req, res) => {

    pool.getConnection((err, connection) => {

        connection.query("SELECT * FROM accounts", (err, rows) => {

            if (err) {
                res.json({"status": "500"});
                res.status(500);
            }

            if (rows.length > 0) {

                res.charset = "utf8";
                let json = [];
                for (let i = 0; i < rows.length; i++) {
                    let row = rows[i];
                    json.push({
                        "id": row.id,
                        "firstname": row.firstname,
                        "lastname": row.lastname,
                        "form": row.form,
                        "email": row.email,
                        "status": row.status
                    });
                }

                res.json(json);


            }

        });

        connection.release();

    });


});

router.get('/wifi-users/json/callback/user/:id', (req, res) => {

    pool.getConnection((err, connection) => {

        connection.query("SELECT * FROM accounts WHERE id='" + req.params.id + "'", (err, rows) => {

            if (err) {
                res.json({"status": "500"});
                res.status(500);
            }

            if (rows.length > 0) {

                res.charset = "utf8";
                let json = [];
                for (let i = 0; i < rows.length; i++) {
                    let row = rows[i];
                    json.push({
                        "id": row.id,
                        "firstname": row.firstname,
                        "lastname": row.lastname,
                        "form": row.form,
                        "email": row.email,
                        "status": row.status
                    });
                }

                res.json(json);


            }

        });

        connection.release();

    });


});

router.post('/login', (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    let hash = crypto.createHmac('sha512', 'lgnIT2014!');
    hash.update(password);
    let value = hash.digest('Hex');

    pool.getConnection((err, connection) => {

        let maintenance = true;

        connection.query("SELECT value FROM status WHERE type='Maintenance'", (err, rows) => {

            if (rows.length > 0) {
                if (rows[0] == "false") {
                    maintenance = false;
                }
            }

        });

        connection.query("SELECT * FROM dashboard_users WHERE email='" + email + "' LIMIT 1", (err, rows) => {

            if (err) {
                res.redirect('/');
            }
            if (rows.length > 0) {

                if (maintenance = true) {
                    if (rows[0].maintenance == "true") {
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
                        res.sendFile(path.join(__dirname + '/../views/api/login-maintenance.html'));
                    }
                } else {
                    if (value == rows[0].password) {
                        let token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
                        res.cookie('token', token);
                        users.push(token);
                        console.log('\x1b[32m[Info] [Users] ' + rows[0].firstname + ' ' + rows[0].lastname + ' has logged in!');
                        res.redirect('/');
                    } else {
                        res.redirect('/');
                    }
                }
            } else {
                res.sendFile(path.join(__dirname + '/../views/api/login-failed.html'));
            }

        });
        connection.release();
    });


});

router.post('/mail', (res, req) => {


});

module.exports = router;
module.exports.users = users;