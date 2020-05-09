// require = require('esm')(module);
// module.exports = require('./sockets-service.js');

import express from 'express';
import http from 'http';
// let http = require('http').createServer(app);
import socketio from 'socket.io';
// let io = require('socket.io')(http);
import Food from './server-food.mjs';
let app = express();
let httpServer = http.createServer(app);
let io = socketio(httpServer);

app.use(express.static('../client'));

let food = new Food({ x: 800, y: 600 }, 10);

food.generate(200);

io.on('connection', socket => {
	socket.on('connect', () => {
		socket.broadcast.emit('broadcast', data);
	});

	socket.on('request-food', () => {
		socket.emit('send-food', food);
		socket.broadcast.emit('send-food', food);
	});

	socket.on('request-players', () => {
		console.log('players requested!');
		socket.broadcast.emit('request-players');
	});

	socket.on('player-pos-and-size', data => {
		socket.broadcast.emit('broadcast', data);
	});

	socket.on('disconnect', () => {
		socket.broadcast.emit('user-disconnected', socket.id);
		// console.log("user disconnected", socket);
	});

	socket.on('piece-eaten', id => {
		console.log('piece of food eaten: ', id);
		food.deletePiece(id);
		socket.broadcast.emit('piece-eaten', id);
	});

	socket.on('generate-food', data => {
		food.generate(200);
		socket.emit('send-food', food);
		socket.broadcast.emit('send-food', food);
	});
});

httpServer.listen(3000, () => {
	console.log('listening on *:3000');
});
