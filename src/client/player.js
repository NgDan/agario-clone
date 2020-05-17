import { initialPlayerPosition, mapBoundary, foodColors } from './constants';
import getRandomArrayItem from '../helpers/getRandomArrayItem';
import { set } from 'lodash';
export default function PlayerFactory(position, size, id) {
	let state = {
		id: id,
		size: size,
		speed: 2,
		position: position,
		color: getRandomArrayItem(foodColors),
		alive: true,
	};

	const keyHandler = state => ({
		handleKeys: (sk, socket) => {
			if (sk.keyIsDown(sk.LEFT_ARROW)) {
				state.position.x = state.position.x - state.speed;
				if (state.position.x < mapBoundary.min)
					state.position.x = mapBoundary.min;
			}
			if (sk.keyIsDown(sk.RIGHT_ARROW)) {
				state.position.x = state.position.x + state.speed;
				if (state.position.x > mapBoundary.max)
					state.position.x = mapBoundary.max;
			}
			if (sk.keyIsDown(sk.UP_ARROW)) {
				state.position.y = state.position.y - state.speed;
				if (state.position.y < mapBoundary.min)
					state.position.y = mapBoundary.min;
			}
			if (sk.keyIsDown(sk.DOWN_ARROW)) {
				state.position.y = state.position.y + state.speed;
				if (state.position.y > mapBoundary.max)
					state.position.y = mapBoundary.max;
			}
			socket.emit('player-pos-and-size', {
				id: socket.id,
				position: state.position,
				size: state.size,
				color: state.color,
			});
			console.log(state.color);
		},
	});

	const positionUpdater = state => ({
		updatePosition: position => {
			set(state, 'position', position);
		},
	});

	const sizeUpdater = state => ({
		updateSize: size => {
			state.size += size;
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
		...keyHandler(state),
		...positionUpdater(state),
		...sizeUpdater(state),
		...drawer(state),
	});
}
