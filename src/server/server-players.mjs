import set from 'lodash/set';
import get from 'lodash/get';
import { initialPlayerSize, mapBoundary, foodColors } from './constants';
import getRandomArrayItem from './helpers/getRandomArrayItem';
import doParticlesCollide from './helpers/doParticlesCollide';

const playerInserter = state => ({
	insertPlayer: player => {
		// const playerObjectPath = `players[${id}]`;
		// const initialPlayerValues = {
		// 	size: initialPlayerSize,
		// 	position: {
		// 		x: Math.ceil(Math.random() * mapBoundary.max),
		// 		y: Math.ceil(Math.random() * mapBoundary.max),
		// 	},
		// 	color: getRandomArrayItem(foodColors),
		// 	alive: true,
		// };

		player && set(state, 'players', player);
	},
});

const playerKiller = state => ({
	killPlayer: id => id && set(state, `players[${id}].alive`, false),
});

const playerRemover = state => ({
	removePlayer: id => id && delete state.players[id],
});

const playerMover = state => ({
	movePlayer: (id, position) =>
		id && position && set(state, `players[${id}].position`, position),
});

const positionGetter = state => ({
	getPosition: id => get(state, `players[${id}].position`),
});

const sizeSetter = state => ({
	setSize: (id, size) => id && size && set(state, `players[${id}].size`, size),
});

const sizeGetter = state => ({
	getSize: id => get(state, `players[${id}].size`),
});

const collisionDetector = (state, { killPlayer }) => ({
	detectCollision: tolerance => {
		let players = state.players;
		for (let id in players) {
			const player1 = players[id];
			const player1Id = id;
			console.log(players);
			for (const id in players) {
				const player2 = players[id];
				const player2Id = id;
				if (player1Id !== player2Id) {
					const particle1 = {
						id: player1Id,
						x: get(player1, 'position.x'),
						y: get(player1, 'position.y'),
						size: get(player1, 'size'),
					};
					const particle2 = {
						id: player2Id,
						x: get(player2, 'position.x'),
						y: get(player2, 'position.y'),
						size: get(player2, 'size'),
					};

					if (
						doParticlesCollide(particle1, particle2, tolerance) &&
						Math.abs(particle1.size - particle2.size) > 1
					) {
						console.log('collision');
						particle1.size > particle2.size
							? killPlayer(particle2.id)
							: killPlayer(particle1.id);
					}
				}
			}
		}
	},
});

const PlayersFactory = () => {
	const state = {
		players: {},
	};

	return Object.freeze({
		state,
		...playerMover(state),
		...playerKiller(state),
		...playerRemover(state),
		...positionGetter(state),
		...sizeSetter(state),
		...sizeGetter(state),
		...collisionDetector(state, playerKiller(state)),
	});
};

export { PlayersFactory };
