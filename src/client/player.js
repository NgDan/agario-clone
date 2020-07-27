import { initialPlayerPosition, mapBoundary, foodColors } from './constants';
import getRandomArrayItem from '../helpers/getRandomArrayItem';
import { set, get, throttle } from 'lodash';
export default function PlayerFactory(position, size, id, sk, socket) {
	let state = {
		id: id,
		size: size,
		speed: 2,
		position: position,
		color: getRandomArrayItem(foodColors),
		alive: true,
	};

	const keepAliver = socket => ({
		keepAlive: throttle(() => {
			socket.emit('keep-alive', socket.id);
		}, 5000),
	});

	const keyHandler = (state, sk, socket, { keepAlive }) => ({
		handleKeys: () => {
			if (sk.keyIsDown(sk.LEFT_ARROW)) {
				state.position.x = state.position.x - state.speed;
				socket.emit('new-player-position', {
					id: socket.id,
					position: get(state, 'position'),
				});

				keepAlive();

				if (state.position.x < mapBoundary.min) {
					state.position.x = mapBoundary.min;
				}
			}
			if (sk.keyIsDown(sk.RIGHT_ARROW)) {
				state.position.x = state.position.x + state.speed;
				socket.emit('new-player-position', {
					id: socket.id,
					position: get(state, 'position'),
				});

				keepAlive();

				if (state.position.x > mapBoundary.max) {
					state.position.x = mapBoundary.max;
				}
			}
			if (sk.keyIsDown(sk.UP_ARROW)) {
				state.position.y = state.position.y - state.speed;
				socket.emit('new-player-position', {
					id: socket.id,
					position: get(state, 'position'),
				});

				keepAlive();

				if (state.position.y < mapBoundary.min) {
					state.position.y = mapBoundary.min;
				}
			}
			if (sk.keyIsDown(sk.DOWN_ARROW)) {
				state.position.y = state.position.y + state.speed;
				socket.emit('new-player-position', {
					id: socket.id,
					position: get(state, 'position'),
				});

				keepAlive();

				if (state.position.y > mapBoundary.max) {
					state.position.y = mapBoundary.max;
				}
			}
		},
	});

	const positionUpdater = state => ({
		updatePosition: position => {
			set(state, 'position', position);
		},
	});

	const killer = state => ({
		kill: () => {
			set(state, 'alive', false);
		},
	});

	const playerResurecter = state => ({
		resurectPlayer: () => set(state, 'alive', true),
	});

	const sizeUpdater = state => ({
		updateSize: size => {
			set(state, 'size', size);
		},
	});

	const playerSyncer = state => ({
		syncPlayer: player => {
			set(state, 'alive', get(player, 'alive'));
		},
	});

	const drawer = state => ({
		draw: sk => {
			if (state.alive) {
				sk.push();
				sk.fill(state.color);
				sk.noStroke();

				sk.translate(initialPlayerPosition.x, initialPlayerPosition.y);
				sk.translate(-state.position.x, -state.position.y);

				sk.ellipse(state.position.x, state.position.y, state.size);
				sk.fill('white');
				sk.pop();
			}
		},
	});

	return Object.freeze({
		state,
		...keyHandler(state, sk, socket, keepAliver(socket)),
		...positionUpdater(state),
		...sizeUpdater(state),
		...drawer(state),
		...killer(state),
		...playerResurecter(state),
		...playerSyncer(state),
	});
}
