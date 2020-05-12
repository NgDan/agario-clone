import PlayersConstructor from './players';
import { FoodFactory } from './client-food';
import Player from './player';
import { initialPlayerPosition } from './constants';
import io from 'socket.io-client';

let s = sk => {
	const setup = () => {
		sk.socket = io();
		sk.frameRate(60);
		sk.createCanvas(800, 600);

		sk.player = new Player(
			{ x: initialPlayerPosition.x, y: initialPlayerPosition.y },
			80
		);

		sk.players = PlayersConstructor(sk);

		sk.food = FoodFactory();

		sk.socket.on('connect', () => {
			setTimeout(() => {
				sk.socket.emit('request-food');
				sk.socket.emit('request-players');
			}, 500);
		});

		sk.socket.on('request-players', () => {
			sk.socket.emit('player-pos-and-size', {
				id: sk.socket.id,
				position: sk.player.position,
				size: sk.player.size,
			});
		});

		sk.socket.on('send-food', foodFromServer => {
			sk.food.setFood(foodFromServer.food, foodFromServer.foodSize);
		});

		sk.socket.on('piece-eaten', id => {
			sk.food.deletePiece(id);
		});

		sk.socket.on('broadcast', data => {
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
		document.querySelector('.request-food').addEventListener('click', () => {
			sk.socket.emit('reset-food');
		});
	};

	// TODO: make translate func reusable
	// DO measurements to get an idea of the bandwidth used when playing
	// make player.position object consistent on both players and food
	// implement "eat player functionality"
	// zoom out when player grows

	const draw = () => {
		sk.background(100);
		sk.player.draw(sk);
		sk.player.handleKeys(sk, sk.socket);
		sk.players.draw({
			x: sk.player.position.x - initialPlayerPosition.x,
			y: sk.player.position.y - initialPlayerPosition.y,
		});
		sk.food.translateFood(
			sk.player.position.x - initialPlayerPosition.x,
			sk.player.position.y - initialPlayerPosition.y,
			sk
		);
		sk.food.draw(sk);
		sk.food.collisionDetector(
			sk.player.position.x,
			sk.player.position.y,
			sk.player.size,
			sk.player,
			sk.socket
		);
	};
	sk.setup = setup;
	sk.draw = draw;
};

const P5 = new p5(s);
