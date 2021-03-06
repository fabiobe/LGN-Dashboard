/**
 * Created by fabio on 20.11.2016.
 */
let express = require('express');
let router = express.Router();
let path = require('path');
let mysql = require("mysql");
let users = require('./api.js').users;
let mysql_config = require('./../config/mysql.json');

let pool = mysql.createPool(mysql_config);

router.get('/', (req, res) => {

    if (req.cookies.token !== undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/dashboard.html'));
            return;
        }
    }

    pool.getConnection((err, connection) => {
        connection.query("SELECT value FROM status WHERE type='Maintenance'", (err, rows) => {

            if (rows.length > 0) {
                if (rows[0].value === "false") {
                    res.sendFile(path.join(__dirname, '../views/api/login.html'));
                } else {
                    res.sendFile(path.join(__dirname, '../views/default/maintenance-login.html'));
                }
            } else {
                res.sendFile(path.join(__dirname, '../views/default/maintenance-login.html'));
            }
        });

        connection.release();
    });


});

router.get('/profile', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/profile.html'));
            return;
        }
    }
    res.redirect('/');
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/default/login.html'));
});

router.get('/dashboard', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/dashboard.html'));
            return;
        }
    }
    res.redirect('/');
});

router.get('/reports', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/reports.html'));
            return;
        }
    }
    res.redirect('/');
});

router.get('/users', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/users.html'));
            return;
        }
    }
    res.redirect('/');
});

router.get('/wifi', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/wifi.html'));
            return;
        }
    }
    res.redirect('/');
});

router.get('/email', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/email.html'));
            return;
        }
    }
    res.redirect('/');
});

router.get('/tasks', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/tasks.html'));
            return;
        }
    }
    res.redirect('/');
});

router.get('/servers', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/servers.html'));
            return;
        }
    }
    res.redirect('/');
});

router.get('/printers', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/printers.html'));
            return;
        }
    }
    res.redirect('/');
});

router.get('/settings', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/settings.html'));
            return;
        }
    }
    res.redirect('/');
});

module.exports = router;