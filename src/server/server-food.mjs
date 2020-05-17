import set from 'lodash';
import { foodColors } from './constants';
import getRandomArrayItem from './helpers/getRandomArrayItem';

const FoodFactory = (canvasDimensions, foodSize) => {
	const state = {
		food: {},
		foodSize: foodSize,
		canvasDimensions: canvasDimensions,
	};

	const generator = state => ({
		generate: numberOfPieces => {
			for (let i = 0; i < numberOfPieces; i++) {
				let x = Math.floor(Math.random() * state.canvasDimensions.x);
				let y = Math.floor(Math.random() * state.canvasDimensions.y);
				let id = '' + x + y;
				let color = getRandomArrayItem(foodColors);
				state.food[id] = { x: x, y: y, color: color, active: true };
			}
		},
	});

	const deleter = state => ({
		deletePiece: id => {
			set(state, `food[${[id]}].active`, false);
		},
	});

	const resetter = state => ({
		resetFood: () => {
			let food = state.food;
			for (const id in food) {
				set(state, `food[${[id]}].active`, true);
				// state.food[id].active = true;
			}
		},
	});

	return Object.freeze({
		state,
		...generator(state),
		...deleter(state),
		...resetter(state),
	});
};

export { FoodFactory };
