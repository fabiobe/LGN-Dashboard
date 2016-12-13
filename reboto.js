/**
 * Created by fabio on 21.11.2016.
 */
let child_process = require('child_process');
let date = new Date();
let chalk = require('chalk');
var net = require('net');
let workerProcess = child_process.spawn("node", ["server.js"]);
let running = true;

let server = net.createServer((socket) => {

    socket.on("error", (err) => {
        console.log(err.stack);
    });

    socket.on('data', (data) => {

        let message = new Buffer(data).toString().trim();
        if (message === 'stop#238912782956712') {
            if (running) {
                workerProcess.kill('SIGINT');
                console.log(chalk.cyan('[' + date.toISOString().split('T')[0] + ' ' + date.getHours() + ':' + addZero(date.getMinutes()) + ':' + date.getSeconds() + '] ') + '[Info] [DASHBOARD] Stopped for update' + '\x1b[0m');
                running = false;
            }

        }

    });


}).listen(2020);

/*app.get('/', (req, res) => {

 if (running) {
 workerProcess.kill('SIGINT');
 console.log(chalk.cyan('[' + date.toISOString().split('T')[0] + ' ' + date.getHours() + ':' + addZero(date.getMinutes()) + ':' + date.getSeconds() + '] ') + '[Info] [DASHBOARD] Stopped for update' + '\x1b[0m');
 running = false;
 res.send("stopped");
 } else {
 workerProcess = child_process.spawn("node", ["server.js"]);
 running = true;
 res.send("started");
 }

 });*/

workerProcess.stdout.on('data', (data) => {
    if (new String(data).trim() === "exit") {
        workerProcess.kill();
        server.close();
        return;
    }
    console.log(chalk.cyan('[' + date.toISOString().split('T')[0] + ' ' + date.getHours() + ':' + addZero(date.getMinutes()) + ':' + date.getSeconds() + '] ') + data + '\x1b[0m');
});

workerProcess.stderr.on('data', (data) => {
    console.log(chalk.red('[' + date.toISOString().split('T')[0] + ' ' + date.getHours() + ':' + addZero(date.getMinutes()) + ':' + date.getSeconds() + '] ') + data + '\x1b[0m');
});

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}