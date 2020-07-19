import PlayersConstructor from './players';
import { FoodFactory } from './client-food';
import PlayerFactory from './player';
import { initialPlayerPosition } from './constants';
import io from 'socket.io-client';

let s = sk => {
	let overlay;
	let checkExist = setInterval(() => {
		if (document.querySelector('.overlay')) {
			console.log('Exists!');
			overlay = document.querySelector('.overlay');
			clearInterval(checkExist);
		}
	}, 100);
	const setup = () => {
		sk.height = 600;
		sk.width = 800;
		sk.io = io;
		sk.socket = io();
		sk.frameRate(60);
		sk.createCanvas(sk.width, sk.height, sk.WEBGL);

		sk.socket.on('connect', () => {
			sk.player = PlayerFactory(
				{ x: initialPlayerPosition.x, y: initialPlayerPosition.y },
				80,
				sk.socket.id,
				sk,
				sk.socket
			);
			console.log('connected');
			sk.players = PlayersConstructor(sk);

			sk.food = FoodFactory(10, sk);
			sk.socket.emit('request-food');
			sk.socket.emit('request-players');
			sk.socket.emit('player-joined', sk.player.state);
			console.log('player-joined: ', sk.player.state);
		});

		sk.socket.on('send-food', foodFromServer => {
			sk.food.setFood(foodFromServer.food, foodFromServer.foodSize);
		});

		// will replace old event
		sk.socket.on('piece-of-food-eaten', id => {
			console.log('piece of food eaten: ', id);
			sk.food.deletePiece(id);
		});

		sk.socket.on('server-player-joind', player => {
			console.log('new player joined:', player);
		});

		sk.socket.on('sync-food-state', food => {
			sk.food.syncFood(food);
		});

		sk.socket.on('sync-players-state', players => {
			sk.players.syncPlayersState(players);
			//sync player state
			sk.player.syncPlayer(players[sk.socket.id]);
		});

		sk.socket.on('new-player-size', data => {
			sk.player.state.id === data.id && sk.player.updateSize(data.size);
		});

		sk.socket.on('broadcast', data => {
			sk.players.update(data);
		});

		sk.socket.on('user-disconnected', id => {
			sk.players.remove(id);
		});

		// new events

		sk.socket.on('new-player-position-from-server', data => {
			sk.players.movePlayer(data.id, data.position);
		});

		sk.socket.on('player-has-been-killed', id => {
			console.log('player-has-been-killed: ', id);
			sk.players.killPlayer(id);
		});

		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'visible') {
				sk.socket.emit('request-players');
			}
		});

		// temporary for development purposes
		document.querySelector('.add-overlay').addEventListener('click', food => {
			// sk.socket.emit('reset-food');
			console.log((overlay.style.display = 'flex'));
		});
		document
			.querySelector('.remove-overlay')
			.addEventListener('click', food => {
				// sk.socket.emit('reset-food');
				console.log((overlay.style.display = 'none'));
			});
	};

	const draw = () => {
		// let zoomOut = 100;
		// sk.plane(10, 10);
		// sk.translate;
		if (sk.players && sk.player) {
			sk.camera(
				sk.width,
				sk.height,
				sk.player.state.size + sk.height / 2 / sk.tan((sk.PI * 30.0) / 180.0),
				sk.width,
				sk.height,
				0,
				0,
				1,
				0
			);
			const playerIsAlive = sk.player.state.alive;
			sk.background(100);
			sk.player.draw(sk);
			playerIsAlive && sk.player.handleKeys(sk, sk.socket);
			sk.players.draw({
				x: sk.player.state.position.x - initialPlayerPosition.x,
				y: sk.player.state.position.y - initialPlayerPosition.y,
			});
			sk.food.translateFood(
				sk.player.state.position.x - initialPlayerPosition.x,
				sk.player.state.position.y - initialPlayerPosition.y,
				sk
			);
			sk.food.draw(sk);
		}
	};
	sk.setup = setup;
	sk.draw = draw;
};

const P5 = new p5(s);
