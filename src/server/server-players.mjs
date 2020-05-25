import set from 'lodash/set';
import get from 'lodash/get';
import { initialPlayerSize, mapBoundary, foodColors } from './constants';
import getRandomArrayItem from './helpers/getRandomArrayItem';

const playerInserter = state => ({
	insertPlayer: id => {
		const playerObjectPath = `players[${id}]`;
		const initialPlayerValues = {
			size: initialPlayerSize,
			position: {
				x: Math.ceil(Math.random() * mapBoundary.max),
				y: Math.ceil(Math.random() * mapBoundary.max),
			},
			color: getRandomArrayItem(foodColors),
			alive: true,
		};

		set(state, playerObjectPath, initialPlayerValues);
	},
});

const playerKiller = state => ({
	killPlayer: id => set(state, `players[${id}].alive`, false),
});

const playerMover = state => ({
	movePlayer: (id, position) => set(state, `players[${id}].position`, position),
});

const positionGetter = state => ({
	getPosition: id => get(state, `players[${id}].position`),
});

const sizeGetter = state => ({
	getSize: id => get(state, `players[${id}].size`),
});

const PlayersFactory = () => {
	const state = {
		players: {
			idFromSocket: {
				size: 1,
				position: {
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
		...playerKiller(state),
		...positionGetter(state),
		...sizeGetter(state),
	});
};

export { PlayersFactory };
