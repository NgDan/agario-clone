import set from 'lodash/set';
import get from 'lodash/get';
import { initialPlayerSize, mapBoundary, foodColors } from './constants';
import getRandomArrayItem from './helpers/getRandomArrayItem';
import doParticlesCollide from './helpers/doParticlesCollide';

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

const collisionDetector = state => ({
	detectCollision: (player, tolerance = 0) => {
		const players = state.players;
		for (let id in players) {
			const player1 = players[id];
			const player1Id = id;
			for (let id in players) {
				const player2 = players[id];
				const player2Id = id;
				if (player1Id !== player2Id) {
					// console.log(player1Id, player1);
					// console.log(player2Id, player2);
					const particle1 = {
						id: player1Id,
						x: player1.position.x,
						y: player1.position.y,
						size: player1.size,
					};
					const particle2 = {
						id: player2Id,
						x: player2.position.x,
						y: player2.position.y,
						size: player2.size,
					};
					if (
						doParticlesCollide(particle1, particle2, tolerance) &&
						Math.abs(particle1.size - particle2.size) > 1
					) {
						return particle1.size > particle2.size
							? { loser: particle2.id, winner: particle1.id }
							: { loser: particle1.id, winner: particle2.id };
					}
					return false;
				}
			}
		}
	},
});

const PlayersFactory = () => {
	const state = {
		players: {
			abc1: {
				size: 1,
				position: {
					x: 1,
					y: 1,
				},
				color: 'blue',
				alive: true,
			},
			// abc2: {
			// 	size: 2,
			// 	position: {
			// 		x: 1,
			// 		y: 1,
			// 	},
			// 	color: 'blue',
			// 	alive: true,
			// },
		},
	};

	return Object.freeze({
		state,
		...playerInserter(state),
		...playerMover(state),
		...playerKiller(state),
		...positionGetter(state),
		...sizeGetter(state),
		...collisionDetector(state),
	});
};

export { PlayersFactory };
