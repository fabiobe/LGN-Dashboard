/**
 * Created by fabio on 11.12.2016.
 */
let express = require('express');
let router = express.Router();
let path = require('path');
let Hashmap = require('hashmap');
let authenticatedUsers = new Hashmap();
let users = require('./api.js').users;

module.exports = router;