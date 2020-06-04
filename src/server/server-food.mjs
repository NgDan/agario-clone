import set from 'lodash/set';
import { foodColors } from './constants';
import getRandomArrayItem from './helpers/getRandomArrayItem';
import doParticlesCollide from './helpers/doParticlesCollide';

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
		}
	},
});

const createCollisionDetector = (
	foodState,
	doParticlesCollide,
	{ deletePiece }
) => ({
	foodCollisionDetector: (playersState, socket, increaseSize) => {
		for (let id in foodState.food) {
			let piece = foodState.food[id];
			for (let playerId in playersState) {
				let player = playersState[playerId];
				let playerProps = {
					x: player.position.x,
					y: player.position.y,
					size: player.size,
				};
				let pieceOfFoodProps = {
					x: piece.x,
					y: piece.y,
					size: foodState.foodSize,
				};

				if (doParticlesCollide(pieceOfFoodProps, playerProps) && piece.active) {
					deletePiece(id);
					socket.broadcast.emit('piece-of-food-eaten', id);
					increaseSize(playerId, 1);
					socket.broadcast.emit('new-player-size', {
						id: playerId,
						size: player.size,
					});
				}
			}
		}
	},
});

const FoodFactory = (canvasDimensions, foodSize) => {
	const state = {
		food: {},
		foodSize: foodSize,
		canvasDimensions: canvasDimensions,
	};

	return Object.freeze({
		state,
		...generator(state),
		...deleter(state),
		...createCollisionDetector(state, doParticlesCollide, deleter(state)),
		...resetter(state),
	});
};

export { FoodFactory };
