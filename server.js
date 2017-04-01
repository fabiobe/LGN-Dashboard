/**
 * Created by fabio on 10.11.2016.
 */
let express = require('express');
let path = require('path');
let app = express();
app.disable('x-powered-by');
let app2 = express();
let server = require('http').Server(app2);
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let https = require('https');
let fs = require('fs');
let mysql = require('mysql');
let mysql_config = require('./config/mysql.json');
let pool = mysql.createPool(mysql_config);

/* CONFIGURATION */

let config = require('./config/config.json');

/* END OF CONFIGURATION */

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public/')));

app2.get("/logo", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/images/logo.png'));
});

app2.get("*", (req, res) => {
    res.status = 301;
    res.redirect("https://it.lg-n.de");
});

if (config.setup) {

    /* ROUTERS */
    let defaultRouter = require('./routers/default.js');
    let apiRouter = require('./routers/api.js');
    let helpRouter = require('./routers/help.js');
    let accountsRouter = require('./routers/accounts.js');
    /* END OF ROUTERS*/

    app.use('/', defaultRouter);
    app.use('/api', apiRouter);
    app.use('/support', helpRouter);
    app.use('/accounts', accountsRouter);

    app.get('*', (req, res) => {
        res.status(404).sendFile(path.join(__dirname, '/views/default/404.html'));
    });


} else {
    let setupRouter = require('./routers/setup.js');
    app.use('/setup', setupRouter);

    app.get('*', (req, res) => {
        res.redirect('/setup');
    });

}

let sserver = https.createServer({
    key: fs.readFileSync('certs/key.pem'),
    cert: fs.readFileSync('certs/pub.pem')
}, app).listen(443);


let io = require('socket.io')(sserver);

io.on('connection', (socket) => {

    socket.on("todo-update", (data) => {
        let id = data.id;

        pool.getConnection((err, connection) => {
            connection.query("SELECT * FROM todo WHERE id='" + id + "'", (err, rows) => {

                if (rows.length > 0) {
                    let row = rows[0];
                    let checked = 0;
                    if (row.checked == 0) {
                        checked = 1;
                    } else {
                        checked = 0;
                    }
                    connection.query("UPDATE todo SET checked='" + checked + "'");
                }
            });
            connection.release();
        });

        io.emit("todo-update", data);

    });

    socket.on("todo-add", (data) => {

        pool.getConnection((err, connection) => {
            connection.query("INSERT INTO todo (priority, task, checked) VALUES ('" + data.priority + "', '" + data.task + "', 0)");
            connection.release();
        });

        io.emit("todo-update", {});

    });

});


server.listen(80);

console.log('\x1b[32m[Info] [WEB] Listening on port: 80');

module.exports.io = io;