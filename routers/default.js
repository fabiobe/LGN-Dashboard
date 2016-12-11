/**
 * Created by fabio on 20.11.2016.
 */
let express = require('express');
let router = express.Router();
let path = require('path');
let Hashmap = require('hashmap');
let authenticatedUsers = new Hashmap();
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

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/default/login.html'));
});

router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/default/dashboard.html'));
});

router.get('/reports', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/default/reports.html'));
});

router.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/default/users.html'));
});

router.get('/wifi', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/default/wifi.html'));
});

router.get('/email', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/default/email.html'));
});

router.get('/tasks', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/default/tasks.html'));
});

router.get('/servers', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/default/servers.html'));
});

router.get('/printers', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/default/printers.html'));
});

router.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/default/settings.html'));
});

module.exports = router;