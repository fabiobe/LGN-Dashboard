/**
 * Created by fabio on 21.11.2016.
 */
let express = require('express');
let router = express.Router();
let path = require('path');

router.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, '../views/setup/login.html'));

});

module.exports = router;