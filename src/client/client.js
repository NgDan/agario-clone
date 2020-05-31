import PlayersConstructor from './players';
import { FoodFactory } from './client-food';
import PlayerFactory from './player';
import { initialPlayerPosition } from './constants';
import io from 'socket.io-client';
import { get } from 'lodash';

let s = sk => {
	const setup = () => {
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

		sk.socket.on('request-players', () => {
			sk.socket.emit('player-new-pos-and-size', get(sk, 'player.state'));
		});

		sk.socket.on('send-food', foodFromServer => {
			sk.food.setFood(foodFromServer.food, foodFromServer.foodSize);
		});

		sk.socket.on('piece-eaten', id => {
			sk.food.deletePiece(id);
		});

		sk.socket.on('broadcast', data => {
			console.log('data: ', data);
			sk.players.update(data);
		});

		sk.socket.on('user-disconnected', id => {
			sk.players.remove(id);
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
			playerIsAlive &&
				sk.food.foodCollisionDetector(
					sk.player.state.position.x,
					sk.player.state.position.y,
					sk.player.state.size,
					sk.player,
					sk.socket
				);
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
