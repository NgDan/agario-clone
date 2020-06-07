import PlayersConstructor from './players';
import { FoodFactory } from './client-food';
import PlayerFactory from './player';
import { initialPlayerPosition } from './constants';
import io from 'socket.io-client';
import { get } from 'lodash';

let s = sk => {
	const setup = () => {
		sk.io = io;
		sk.socket = io();
		sk.frameRate(60);
		sk.createCanvas(800, 600);

		sk.socket.on('connect', () => {
			sk.player = PlayerFactory(
				{ x: initialPlayerPosition.x, y: initialPlayerPosition.y },
				80,
				sk.socket.id
			);
			console.log('connected');
			sk.players = PlayersConstructor(sk);

			sk.food = FoodFactory();
			sk.socket.emit('request-food');
			sk.socket.emit('request-players');
			sk.socket.emit('player-joined', sk.player.state);
			console.log('player-joined: ', sk.player.state);
		});

		sk.socket.on('send-food', foodFromServer => {
			sk.food.setFood(foodFromServer.food, foodFromServer.foodSize);
		});

		sk.socket.on('piece-eaten', id => {
			// sk.food.deletePiece(id);
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
			console.log('self: ', players[sk.socket.id]);
		});

		sk.socket.on('new-player-size', data => {
			// console.log('data from new-player-size event: ', data);
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

		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'visible') {
				sk.socket.emit('request-players');
			}
		});

		//temporary for development purposes
		document.querySelector('.request-food').addEventListener('click', food => {
			sk.socket.emit('reset-food');
		});
	};

	// TODO: make translate func reusable
	// DO measurements to get an idea of the bandwidth used when playing
	// implement "eat player functionality"
	// zoom out when player grows

	const draw = () => {
		if (sk.players && sk.player) {
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
			const collisionResults = sk.players.playersCollisionDetector(
				sk.player.state,
				0.25
			);
			if (collisionResults && collisionResults.loser === sk.player.state.id) {
				sk.player.kill();
			}
			if (collisionResults && collisionResults.winner === sk.player.state.id) {
				const loser = sk.players.state.players[collisionResults.loser];
				sk.player.updateSize(loser.size);
			}
			collisionResults && sk.players.remove(collisionResults.loser);
		}
	};
	sk.setup = setup;
	sk.draw = draw;
};

const P5 = new p5(s);
