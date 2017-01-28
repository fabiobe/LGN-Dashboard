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

console.log("\x1b[36m[Debug] [ACCOUNTS] starting...");

router.get('/id/:id', (req, res) => {

    res.sendFile(path.join(__dirname, '/views/accounts/user.html'));

});

module.exports = router;