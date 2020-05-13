import { initialPlayerPosition } from './constants';

export default function PlayerFactory(position, size, id = 0) {
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
				if (state.position.x < 0) state.position.x = 0;
			}
			if (sk.keyIsDown(sk.RIGHT_ARROW)) {
				state.position.x = state.position.x + state.speed;
				if (state.position.x > 1500) state.position.x = 1500;
			}
			if (sk.keyIsDown(sk.UP_ARROW)) {
				state.position.y = state.position.y - state.speed;
				if (state.position.y < 0) state.position.y = 0;
			}
			if (sk.keyIsDown(sk.DOWN_ARROW)) {
				state.position.y = state.position.y + state.speed;
				if (state.position.y > 1500) state.position.y = 1500;
			}
			socket.emit('player-pos-and-size', {
				id: socket.id,
				position: state.position,
				size: state.size,
			});
		},
	});

	const positionUpdater = state => ({
		updatePosition: position => {
			console.log(position);
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
		...keyHandler(state),
		...positionUpdater(state),
		...sizeUpdater(state),
		...drawer(state),
	});
}
