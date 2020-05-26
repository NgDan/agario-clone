// require = require('esm')(module);
// module.exports = require('./sockets-service.js');

import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import { FoodFactory } from './server-food.mjs';
import { PlayersFactory } from './server-players.mjs';
import { mapBoundary, initialPlayerSize } from './constants';

let app = express();
let httpServer = http.createServer(app);
let io = socketio(httpServer);

app.use(express.static('../client'));

let food = FoodFactory(
	{ x: mapBoundary.max, y: mapBoundary.max },
	initialPlayerSize
);

let players = PlayersFactory();

food.generate(200);

setInterval(() => {
	players.detectCollision(0);
	console.log(players.state);
}, 2000);

io.on('connection', socket => {
	socket.on('request-food', () => {
		socket.emit('send-food', food.state);
		socket.broadcast.emit('send-food', food.state);
		console.log('food requested');
	});

	socket.on('request-players', () => {
		socket.broadcast.emit('request-players');
	});

	socket.on('player-joined', player => {
		// players.insertPlayer(id);
		console.log(player);
	});

	socket.on('player-new-pos-and-size', data => {
		socket.broadcast.emit('broadcast', data);
		players.movePlayer(data.id, data.position);
		players.setSize(data.id, data.size);
		// console.log(players.state.players);
		// players.detectCollision(0);
	});

	socket.on('disconnect', () => {
		socket.broadcast.emit('user-disconnected', socket.id);
		players.removePlayer(socket.id);
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

	socket.on('reset-food', data => {
		food.resetFood();
		socket.emit('send-food', food.state);
		socket.broadcast.emit('send-food', food.state);
	});
});

httpServer.listen(3000, () => {
	console.log('listening on *:3000');
});
