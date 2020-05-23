import set from 'lodash/set';
import { initialPlayerSize } from './constants';

const playerInserter = state => ({
	insertPlayer: id => {
		const playerObjectPath = `players[${id}]`;
		const initialPlayerValues = {
			size: initialPlayerSize,
		};

		set(state, 'sdf', '123');
		console.log(set(state, `players`, 2));
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
