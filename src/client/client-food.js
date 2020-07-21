import { set } from 'lodash';

const foodSetter = state => ({
	setFood: (food, foodSize) => {
		state.food = food;
		state.foodSize = foodSize;
	},
});

const foodSyncer = state => ({
	syncFood: food => {
		set(state, 'food', food);
	},
});

const deleter = state => ({
	deletePiece: id => {
		set(state, `food[${[id]}].active`, false);
	},
});

const translater = (state, sk) => ({
	translateFood: (x, y) => {
		// console.log('food state: ', state);
		state.translateVector.x = -x;
		state.translateVector.y = -y;
		sk.translate(state.translateVector.x, state.translateVector.y);
	},
});

const drawer = state => ({
	draw: sk => {
		for (let item in state.food) {
			let piece = state.food[item];
			if (state.food[item].active) {
				sk.push();
				sk.fill(piece.color);
				sk.noStroke();
				sk.ellipse(piece.x, piece.y, state.foodSize);
				sk.pop();
			}
		}
	},
});

const FoodFactory = (foodSize = 10, sk) => {
	const state = {
		food: [],
		foodSize: foodSize,
		translateVector: { x: 0, y: 0 },
	};

	return Object.freeze({
		state,
		...foodSetter(state),
		...foodSyncer(state),
		...deleter(state),
		...translater(state, sk),
		...drawer(state),
	});
};

export { FoodFactory };
