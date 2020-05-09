import set from 'lodash';

const FoodFactory = (canvasDimensions, size) => {
	let state = {
		food: {},
		size: size,
		canvasDimensions: canvasDimensions,
	};
	let generator = state => ({
		generate: numberOfPieces => {
			for (let i = 0; i < numberOfPieces; i++) {
				let x = Math.floor(Math.random() * state.canvasDimensions.x);
				let y = Math.floor(Math.random() * state.canvasDimensions.y);
				let id = '' + x + y;

				state.food[id] = { x: x, y: y, active: true };
			}
		},
	});
	let deleter = state => ({
		deletePiece: id => {
			set(state, `food[${[id]}].active`, false);
		},
	});

	return Object.freeze({
		state,
		...generator(state),
		...deleter(state),
	});
};

export { FoodFactory };
