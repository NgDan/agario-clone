import set from 'lodash/set';
import { initialPlayerSize, mapBoundary, foodColors } from './constants';
import getRandomArrayItem from './helpers/getRandomArrayItem';

const playerInserter = state => ({
	insertPlayer: id => {
		const playerObjectPath = `players[${id}]`;
		const initialPlayerValues = {
			size: initialPlayerSize,
			pos: {
				x: Math.ceil(Math.random() * mapBoundary.max),
				y: Math.ceil(Math.random() * mapBoundary.max),
			},
			color: getRandomArrayItem(foodColors),
			alive: true,
		};

		set(state, playerObjectPath, initialPlayerValues);
		console.log(state);
	},
});

const playerKiller = state => ({
	killPlayer: id => {
		const playerObjectPath = `players[${id}].alive`;
		set(state, playerObjectPath, false);
	},
});

const playerMover = state => ({
	movePlayer: (id, position) => {
		const playerObjectPath = `players[${id}].position`;
		set(state, playerObjectPath, position);
	},
});

const PlayersFactory = () => {
	const state = {
		players: {
			idFromSocket: {
				size: 1,
				pos: {
					x: 1,
					y: 1,
				},
				color: 'blue',
				alive: true,
			},
		},
	};

	return Object.freeze({
		state,
		...playerInserter(state),
		...playerMover(state),
	});
};

export { PlayersFactory };
