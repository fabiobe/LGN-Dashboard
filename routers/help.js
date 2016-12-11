/**
 * Created by fabio on 21.11.2016.
 */
let express = require('express');
let router = express.Router();
let path = require('path');

router.get('/', (req, res) => {

    res.send('OK');

});

router.get('/faq', (req, res) => {

    res.send('OK');

});

module.exports = router;