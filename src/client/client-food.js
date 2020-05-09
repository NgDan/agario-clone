import { set } from 'lodash';

const FoodFactory = (size = 10) => {
	const state = {
		food: [],
		size: size,
		translateVector: { x: 0, y: 0 },
	};
	const foodSetter = state => ({
		setFood: (food, size) => {
			state.food = food;
			state.size = size;
		},
	});
	let deleter = state => ({
		deletePiece: id => {
			set(state, `food[${[id]}].active`, false);
		},
	});

	let translater = state => ({
		translateFood: (x, y, sk) => {
			state.translateVector.x = -x;
			state.translateVector.y = -y;
			sk.translate(state.translateVector.x, state.translateVector.y);
		},
	});

	let createCollisionDetector = state => ({
		collisionDetector: (x, y, size, player, socket) => {
			for (let id in state.food) {
				let piece = state.food[id];

				if (
					Math.pow(x - piece.x, 2) + Math.pow(y - piece.y, 2) <
						Math.pow(size / 2 + state.size / 2, 2) &&
					state.food[id].active
				) {
					socket.emit('piece-eaten', id);
					state.food[id].active = false;
					player.updateSize(1);
				}
			}
		},
	});

	let drawer = state => ({
		draw: sk => {
			for (let item in state.food) {
				let piece = state.food[item];
				if (state.food[item].active) {
					sk.ellipse(piece.x, piece.y, state.size);
				}
			}
		},
	});

	return Object.freeze({
		state,
		...foodSetter(state),
		...deleter(state),
		...translater(state),
		...createCollisionDetector(state),
		...drawer(state),
	});
};

export { FoodFactory };
