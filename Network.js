'use strict';
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('client'));

app.get('/', function (req, res) {
    res.sendfile('index.html');
});


function broadcast() {
    const usersData = [];
    users.forEach((user) => {
        const userData = user.getData();
        usersData.push(userData);
    });
    

    const packet = {
        usersData,
    };

    const {
        target,
        isTargetOn,
    } = Game;

    if(isTargetOn) {
        packet.target = target;       
    }
    
    io.emit('broadcast', packet);
}

module.exports.broadcast = broadcast;


const Game = require('./Game');

const User = require('./User');
const users = [];



io.on('connection', function (socket) {

    console.log('a user connected');

    const user = new User(socket);
    users.push(user);
    broadcast();

    socket.on('disconnect', () => {
        const index = users.indexOf(user);
        if (index > -1) {
            users.splice(index, 1);
        }
        broadcast();
    });
    
    socket.on('setName', (packet) => {
        const {
            name,
        } = packet;
        user.setName(name);
        broadcast();
    });

    socket.on('hit', (packet) => {
        const {
            x,
            y,
        } = packet;
        Game.onHit(user, x, y);
    });
});

http.listen(process.env.PORT, function () {
    console.log(`listening on *:${process.env.PORT}`);
});

