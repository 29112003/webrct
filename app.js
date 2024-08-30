require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');

const debug = require('debug')('development:app.js');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

// socket .io setup

const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket)=>{
    socket.on("signalingMessage", (message)=>{
        socket.broadcast.emit("signalingMessage", message);
    });
})

app.get('/', function(req, res){
    res.render('index');
})

server.listen(3000, function(req,res){
    console.log('listening on port 3000');
})