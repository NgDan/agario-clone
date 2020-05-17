import { initialPlayerPosition, mapBoundary } from './constants';
import { set } from 'lodash';
import { curry } from 'ramda';
console.log(curry);
export default function PlayerFactory(position, size, id) {
	let state = {
		id: id,
		size: size,
		speed: 2,
		position: position,
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
			});
		},
	});

	const idSetter = state => ({ setId: curry(set)(state, 'id') });

	const positionUpdater = state => ({
		updatePosition: position => {
			state.position = position;
		},
	});

	const sizeUpdater = state => ({
		updateSize: size => {
			state.size += size;
		},
	});

	const drawer = state => ({
		draw: sk => {
			sk.push();
			sk.fill('red');
			sk.translate(initialPlayerPosition.x, initialPlayerPosition.y);
			sk.translate(-state.position.x, -state.position.y);
			sk.ellipse(state.position.x, state.position.y, state.size);
			sk.fill('white');
			sk.pop();
		},
	});

	return Object.freeze({
		state,
		...idSetter(state),
		...keyHandler(state),
		...positionUpdater(state),
		...sizeUpdater(state),
		...drawer(state),
	});
}
