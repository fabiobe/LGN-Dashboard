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
var nodemailer = require("nodemailer");
let fs = require('fs');

var transporter = nodemailer.createTransport('smtps://it@lg-n.de:itaglgn@smtp.variomedia.de');

let pool = mysql.createPool(mysql_config);

let htmlmail = "";

fs.readFile(path.join(__dirname, '../views/accounts/reset.html'), 'utf8', function (err, data) {
    if (err) throw err;
    htmlmail = data;
});

let deactivated = "";

fs.readFile(path.join(__dirname, '../views/accounts/deactivated.html'), 'utf8', function (err, data) {
    if (err) throw err;
    deactivated = data;
});

let activated = "";

fs.readFile(path.join(__dirname, '../views/accounts/activated.html'), 'utf8', function (err, data) {
    if (err) throw err;
    activated = data;
});

let activate = "";

fs.readFile(path.join(__dirname, '../views/accounts/activate.html'), 'utf8', function (err, data) {
    if (err) throw err;
    activate = data;
});


console.log("\x1b[36m[Debug] [API] starting...");

pool.getConnection((err, connection) => {
    connection.query("CREATE TABLE IF NOT EXISTS dashboard_users (id INT(255) NOT NULL AUTO_INCREMENT PRIMARY KEY, firstname VARCHAR(255), lastname VARCHAR(255), email VARCHAR(255), password VARCHAR(255))");
    connection.query("CREATE TABLE IF NOT EXISTS activation (id INT(255) NOT NULL AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255), token VARCHAR(255))");
    connection.query("CREATE TABLE IF NOT EXISTS deactivated (id INT(255) NOT NULL AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255), hashed_password VARCHAR(255))");
    connection.query("CREATE TABLE IF NOT EXISTS activate (id INT(255) NOT NULL AUTO_INCREMENT PRIMARY KEY, firstname VARCHAR(255), lastname VARCHAR(255), form VARCHAR(255), email VARCHAR(255), token VARCHAR(255))");
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

router.get('/todo/list', (req, res) => {

    pool.getConnection((err, connection) => {

        connection.query("SELECT * FROM todo ORDER by CASE WHEN @checked=0 THEN priority DESC, checked ASC", (err, rows) => {
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
                        "priority": row.priority,
                        "task": row.task,
                        "checked": row.checked
                    });
                }

                res.json(json);
            }

        });

        connection.release();

    });
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

router.get('/wifi-users/notactivated/json/callback/user/:id', (req, res) => {

    pool.getConnection((err, connection) => {

        connection.query("SELECT * FROM activate WHERE id='" + req.params.id + "'", (err, rows) => {

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
                        "email": row.email
                    });
                }

                res.json(json);

            }

        });

        connection.release();

    });


});

router.get('/wifi-users/notactivated/json/callback/list', (req, res) => {

    pool.getConnection((err, connection) => {

        connection.query("SELECT * FROM activate", (err, rows) => {

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
                        "email": row.email
                    });
                }

                res.json(json);
            }

        });

        connection.release();

    });


});


router.post('/change/wifi/user', (req, res) => {

    let id = req.body.user;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let form = req.body.form;
    let email = req.body.email;
    let status = req.body.status;

    pool.getConnection((err, connection) => {

        connection.query("UPDATE accounts SET firstname='" + firstname + "', lastname='" + lastname + "', form='" + form + "', email='" + email + "', status='" + status + "' WHERE id='" + id + "'");
        connection.release();

    });

    if (status == '') {

        pool.getConnection((err, connection) => {

            connection.query("SELECT * FROM radius.radcheck WHERE username='" + email + "'", (err, rows) => {

                if (rows.length > 0) {

                    let row = rows[0];
                    let password = row.value;

                    connection.query("INSERT INTO deactivated (email, hashed_password) VALUES('" + email + "', '" + password + "')");
                    connection.query("DELETE FROM radius.radcheck WHERE username='" + email + "'");

                }

            });
            connection.release();

        });

        var mailOptions = {
            from: "Netzwerk AG IT-Administration <it@lg-n.de>",
            to: email,
            subject: "Dein Account wurde deaktiviert!",
            html: deactivated
        };


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
        });

    } else {

        pool.getConnection((err, connection) => {

            connection.query("SELECT * FROM deactivated WHERE email='" + email + "'", (err, rows) => {

                if (rows.length > 0) {

                    let row = rows[0];
                    let password = row.hashed_password;

                    connection.query("INSERT INTO radius.radcheck (username, attribute, op, value) VALUES('" + email + "', 'NT-Password', ':=', '" + password + "')");
                    connection.query("DELETE FROM deactivated WHERE email='" + email + "'");

                }

            });

            connection.release();
        });

        var mailOptions = {
            from: "Netzwerk AG IT-Administration <it@lg-n.de>",
            to: email,
            subject: "Dein Account wurde aktiviert!",
            html: activated
        };


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
        });

    }

    res.redirect('https://it.lg-n.de/accounts/id/' + id);

});

router.post('/change/wifi/notactive/user', (req, res) => {

    let id = req.body.user;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let form = req.body.form;
    let email = req.body.email;

    pool.getConnection((err, connection) => {

        connection.query("UPDATE accounts SET firstname='" + firstname + "', lastname='" + lastname + "', form='" + form + "', email='" + email + "' WHERE id='" + id + "'");
        connection.release();

    });

    res.redirect('https://it.lg-n.de/accounts/notactivated/id/' + id);

});


router.post('/add/wifi/user', (req, res) => {

    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let form = req.body.form;
    let email = req.body.email;

    let id = req.params.id;
    let token = crypto.randomBytes(64).toString('hex');

    let body = activate;

    body = body.replace('replacethis1', "https://it.lg-n.de/accounts/activate/token/" + token);
    body = body.replace('replacethis2', "https://it.lg-n.de/accounts/activate/token/" + token);

    pool.getConnection((err, connection) => {

        connection.query("SELECT * FROM accounts WHERE email='" + email + "'", (err, rows) => {

            if (rows.length > 0) {
                already = true;
            } else {
                connection.query("INSERT INTO activate (firstname, lastname, form, email, token) VALUES('" + firstname + "', '" + lastname + "', '" + form + "', '" + email + "', '" + token + "')");
                var mailOptions = {
                    from: "Netzwerk AG IT-Administration <it@lg-n.de>",
                    to: email,
                    subject: "Deine Zugangsdaten!",
                    html: body
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                });
            }

        });

        connection.release();

    });

    res.redirect('https://it.lg-n.de/accounts/add');


});

router.get("/wifi-users/reset/password/:id", (req, res) => {

    let id = req.params.id;
    let token = crypto.randomBytes(64).toString('hex');

    let body = htmlmail;

    body = body.replace('replacethis1', "https://it.lg-n.de/accounts/change/password/token/" + token);
    body = body.replace('replacethis2', "https://it.lg-n.de/accounts/change/password/token/" + token);

    pool.getConnection((err, connection) => {

        connection.query("SELECT * FROM accounts WHERE id='" + id + "'", (err, rows) => {

            if (rows.length > 0) {
                let row = rows[0];
                let email = row.email;

                connection.query("SELECT * FROM activation WHERE email='" + email + "'", (err, rows) => {
                    if (rows.length > 0) {
                        connection.query("DELETE FROM activation WHERE email='" + email + "'");
                    }
                });

                connection.query("INSERT INTO activation (email, token) VALUES('" + email + "', '" + token + "')");
                connection.query("DELETE FROM radius.radcheck WHERE username='" + email + "'");
                connection.query("UPDATE accounts SET status='' WHERE email='" + email + "'");

                var mailOptions = {
                    from: "Netzwerk AG IT-Administration <it@lg-n.de>",
                    to: email,
                    subject: "Dein Passwort wurde zurückgesetzt!",
                    html: body
                };


                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                });
            }
        });
        connection.release();
    });

    res.redirect('https://it.lg-n.de/accounts/id/' + id);

});

router.post("/wifi-users/reset/password/email/", (req, res) => {

    let email = req.body.email;
    let token = crypto.randomBytes(64).toString('hex');

    let body = htmlmail;

    body = body.replace('replacethis1', "https://it.lg-n.de/accounts/change/password/token/" + token);
    body = body.replace('replacethis2', "https://it.lg-n.de/accounts/change/password/token/" + token);

    pool.getConnection((err, connection) => {

        connection.query("SELECT * FROM accounts WHERE email='" + email + "'", (err, rows) => {

            if (rows.length > 0) {

                connection.query("SELECT * FROM activation WHERE email='" + email + "'", (err, rows) => {
                    if (rows.length > 0) {
                        let id = rows[0].id;
                        connection.query("DELETE FROM activation WHERE id='" + id + "'");
                    }
                });

                connection.query("INSERT INTO activation (email, token) VALUES('" + email + "', '" + token + "')");
                connection.query("DELETE FROM radius.radcheck WHERE username='" + email + "'");
                connection.query("UPDATE accounts SET status='' WHERE email='" + email + "'");

                var mailOptions = {
                    from: "Netzwerk AG IT-Administration <it@lg-n.de>",
                    to: email,
                    subject: "Dein Passwort wurde zurückgesetzt!",
                    html: body
                };


                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                });
            }
        });
        connection.release();
    });

    res.redirect('https://it.lg-n.de/');

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