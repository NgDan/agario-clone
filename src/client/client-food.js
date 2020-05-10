import { set } from 'lodash';

const FoodFactory = (foodSize = 10) => {
	const state = {
		food: [],
		foodSize: foodSize,
		translateVector: { x: 0, y: 0 },
	};
	const foodSetter = state => ({
		setFood: (food, foodSize) => {
			state.food = food;
			state.foodSize = foodSize;
		},
	});
	const deleter = state => ({
		deletePiece: id => {
			set(state, `food[${[id]}].active`, false);
		},
	});

	const translater = state => ({
		translateFood: (x, y, sk) => {
			state.translateVector.x = -x;
			state.translateVector.y = -y;
			sk.translate(state.translateVector.x, state.translateVector.y);
		},
	});

	const createCollisionDetector = state => ({
		collisionDetector: (x, y, size, player, socket) => {
			for (let id in state.food) {
				let piece = state.food[id];

				if (
					Math.pow(x - piece.x, 2) + Math.pow(y - piece.y, 2) <
						Math.pow(size / 2 + state.foodSize / 2, 2) &&
					state.food[id].active
				) {
					socket.emit('piece-eaten', id);
					state.food[id].active = false;
					player.updateSize(1);
				}
			}
		},
	});

	const drawer = state => ({
		draw: sk => {
			for (let item in state.food) {
				let piece = state.food[item];
				if (state.food[item].active) {
					sk.ellipse(piece.x, piece.y, state.foodSize);
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
