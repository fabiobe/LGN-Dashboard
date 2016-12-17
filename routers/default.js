/**
 * Created by fabio on 20.11.2016.
 */
let express = require('express');
let router = express.Router();
let path = require('path');
let users = require('./api.js').users;

router.get('/', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/dashboard.html'));
            return;
        }
    }
    res.sendFile(path.join(__dirname, '../views/default/login.html'));

});

router.get('/profile', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/profile.html'));
            return;
        }
    }
    res.sendFile(path.join(__dirname, '../views/default/login.html'));
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
    res.sendFile(path.join(__dirname, '../views/default/login.html'));
});

router.get('/reports', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/reports.html'));
            return;
        }
    }
    res.sendFile(path.join(__dirname, '../views/default/login.html'));
});

router.get('/users', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/users.html'));
            return;
        }
    }
    res.sendFile(path.join(__dirname, '../views/default/login.html'));
});

router.get('/wifi', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/wifi.html'));
            return;
        }
    }
    res.sendFile(path.join(__dirname, '../views/default/login.html'));
});

router.get('/email', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/email.html'));
            return;
        }
    }
    res.sendFile(path.join(__dirname, '../views/default/login.html'));
});

router.get('/tasks', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/tasks.html'));
            return;
        }
    }
    res.sendFile(path.join(__dirname, '../views/default/login.html'));
});

router.get('/servers', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/servers.html'));
            return;
        }
    }
    res.sendFile(path.join(__dirname, '../views/default/login.html'));
});

router.get('/printers', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/printers.html'));
            return;
        }
    }
    res.sendFile(path.join(__dirname, '../views/default/login.html'));
});

router.get('/settings', (req, res) => {
    if (req.cookies.token != undefined) {
        if (users.indexOf(req.cookies.token) > -1) {
            res.sendFile(path.join(__dirname, '../views/default/settings.html'));
            return;
        }
    }
    res.sendFile(path.join(__dirname, '../views/default/login.html'));
});

module.exports = router;