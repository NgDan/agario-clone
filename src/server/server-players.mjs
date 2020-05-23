import set from 'lodash';
import { initialPlayerSize } from './constants';

const playerInserter = state => ({
	insertPlayer: id => {
		console.log(initialPlayerSize);
		const playerObjectPath = `players.${id}`;
		const initialPlayerValues = {
			size: initialPlayerSize,
		};

		set(state, playerObjectPath, initialPlayerValues);
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
	});
};

export { PlayersFactory };
