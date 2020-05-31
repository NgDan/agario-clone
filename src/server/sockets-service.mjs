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
	// console.log(players.state);
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
		players.insertPlayer(player);
	});

	socket.on('player-new-pos-and-size', data => {
		socket.broadcast.emit('broadcast', data);
		players.movePlayer(data.id, data.position);
		players.setSize(data.id, data.size);
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

	socket.on('piece-of-food-relives', () => {});

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

	socket.on('new-player-position', data => {
		socket.broadcast.emit('new-player-position-from-server', data);
	});
});

// EVENTS
// piece of food eaten *
// piece of food relives (send from collision detector)
// new client position - sent by client to server (payload is ID and new position)
// player moved (payload is ID and new position)
// player died - server detects it and sends id to client (payload is ID)
// player increase size - server detects it and sends id to client
// broadcast food object - server sends whole food object to client (try to avoid too many of these since the payload will be very heavy)
// broadcast players object`

httpServer.listen(3000, () => {
	console.log('listening on *:3000');
});
