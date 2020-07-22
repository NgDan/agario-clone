import set from 'lodash/set';
import get from 'lodash/get';
import doParticlesCollide from './helpers/doParticlesCollide';
import { initialPlayerPosition } from './constants';

const playerInserter = state => ({
	insertPlayer: player => {
		const playerObjectPath = `players[${player.id}]`;
		player.id && player && set(state, playerObjectPath, player);
		set(state, playerObjectPath.inactivityTimeout, player);
	},
});

const playerKiller = (state, io) => ({
	killPlayer: id => {
		id && set(state, `players[${id}].alive`, false);
		io.emit('player-has-been-killed', id);
	},
});

const timerStarter = (state, { killPlayer }) => ({
	startTimer: id => {
		let inactivityTimeout = setTimeout(() => {
			set(state, `players[${id}].inactivityTimeout`, inactivityTimeout);
			console.log('inactivityTimeout: ', state.players[id].inactivityTimeout);
			killPlayer(id);
		}, 5000);
	},
});

const playerRemover = state => ({
	removePlayer: id => id && delete state.players[id],
});

const playerMover = state => ({
	movePlayer: (id, position) =>
		id && position && set(state, `players[${id}].position`, position),
});

const keepAliver = state => ({
	keepAlive: id => {
		const inactivityTimeoutRef = get(state, `players[${id}].inactivityTimeout`);
		console.log(inactivityTimeoutRef);
		clearTimeout(inactivityTimeoutRef);
	},
});

const positionGetter = state => ({
	getPosition: id => get(state, `players[${id}].position`),
});

const sizeSetter = state => ({
	setSize: (id, size) => id && size && set(state, `players[${id}].size`, size),
});

const sizeIncreaser = state => ({
	increaseSize: (playerId, size) => {
		const actualSize = get(state, `players[${playerId}].size`);
		if (actualSize > 650) return 650;
		const sizeIncrease = Math.round(Math.sqrt(size));
		const newSize = actualSize + sizeIncrease;
		playerId && size && set(state, `players[${playerId}].size`, newSize);
		return newSize || actualSize;
	},
});

const playerResetter = state => ({
	resetPlayer: id => {
		set(state, `players[${id}].alive`, true);
		set(state, `players[${id}].position`, {
			x: initialPlayerPosition.x,
			y: initialPlayerPosition.y,
		});
		set(state, `players[${id}].size`, 80);
	},
});

const sizeGetter = state => ({
	getSize: id => get(state, `players[${id}].size`),
});

const collisionDetector = (state, { killPlayer }, { increaseSize }, io) => ({
	detectCollision: tolerance => {
		let players = state.players;
		for (let id in players) {
			const player1 = players[id];
			const player1Id = id;
			for (const id in players) {
				const player2 = players[id];
				const player2Id = id;
				if (player1Id !== player2Id) {
					const particle1 = {
						id: player1Id,
						x: get(player1, 'position.x'),
						y: get(player1, 'position.y'),
						size: get(player1, 'size'),
						alive: get(player1, 'alive'),
					};
					const particle2 = {
						id: player2Id,
						x: get(player2, 'position.x'),
						y: get(player2, 'position.y'),
						size: get(player2, 'size'),
						alive: get(player2, 'alive'),
					};
					if (
						get(player1, 'alive') &&
						get(player2, 'alive') &&
						doParticlesCollide(particle1, particle2, tolerance) &&
						Math.abs(particle1.size - particle2.size) > 1
					) {
						if (particle1.size > particle2.size) {
							killPlayer(particle2.id);
							const newSize = increaseSize(particle1.id, particle2.size);
							console.log('newSize: ', newSize);
							io.emit('new-player-size', { id: particle1.id, size: newSize });
							io.emit('player-has-been-killed', particle2.id);
						} else {
							killPlayer(particle1.id);
							const newSize = increaseSize(particle2.id, particle1.size);
							console.log('newSize: ', newSize);
							io.emit('new-player-size', { id: particle2.id, size: newSize });
							io.emit('player-has-been-killed', particle1.id);
						}
					}
				}
			}
		}
	},
});

const PlayersFactory = io => {
	const state = {
		players: {},
	};

	return Object.freeze({
		state,
		...playerMover(state),
		...playerKiller(state, io),
		...playerRemover(state),
		...positionGetter(state),
		...sizeIncreaser(state),
		...sizeSetter(state),
		...timerStarter(state, playerKiller(state, io)),
		...sizeGetter(state),
		...playerResetter(state),
		...collisionDetector(
			state,
			playerKiller(state, io),
			sizeIncreaser(state),
			io
		),
		...keepAliver(state),
		...playerInserter(state),
	});
};

export { PlayersFactory };
