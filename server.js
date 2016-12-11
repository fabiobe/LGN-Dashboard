/**
 * Created by fabio on 10.11.2016.
 */
let express = require('express');
let path = require('path');
let app = express();
app.disable('x-powered-by');
let server = require('http').Server(app);
let io = require('socket.io')(server);
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

/* ROUTERS */
let defaultRouter = require('./routers/default.js');
let apiRouter = require('./routers/api.js');
let helpRouter = require('./routers/help.js');
let setupRouter = require('./routers/setup.js');
let accountsRouter = require('./routers/accounts.js');
/* END OF ROUTERS*/

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public/')));

app.use('/', defaultRouter);
app.use('/api', apiRouter);
app.use('/support', helpRouter);
app.use('/setup', setupRouter);
app.use('/accounts', accountsRouter);

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/default/404.html'));
});

io.on('connection', (socket) => {


});


server.listen(8080);

console.log('\x1b[32m[Info] [WEB] Listening on port: 8080');

module.exports.io = io;