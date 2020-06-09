import { set, get } from 'lodash';
import doParticlesCollide from '../helpers/doParticlesCollide';

const remover = state => ({
	remove: id => {
		delete state.players[id];
	},
});

const playerKiller = state => ({
	killPlayer: id => id && set(state, `players[${id}].alive`, false),
});

const playerRemover = state => ({
	removePlayer: id => id && delete state.players[id],
});

const playerSyncer = state => ({
	syncPlayersState: players => {
		set(state, 'players', players);
	},
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

const createCollisionDetector = (state, sk) => ({
	playersCollisionDetector: (player, tolerance) => {
		const players = state.players;
		for (let id in players) {
			const remotePlayer = players[id];

			const particle1 = {
				id: get(player, 'id'),
				x: get(player, 'position.x'),
				y: get(player, 'position.y'),
				size: get(player, 'size'),
			};
			const particle2 = {
				id: id,
				x: get(remotePlayer, '.position.x'),
				y: get(remotePlayer, '.position.y'),
				size: get(remotePlayer, 'size'),
			};
			if (
				doParticlesCollide(particle1, particle2, tolerance) &&
				Math.abs(particle1.size - particle2.size) > 30
			) {
				return particle1.size > particle2.size
					? { loser: particle2.id, winner: particle1.id }
					: { loser: particle1.id, winner: particle2.id };
			}
			return false;
		}
	},
});

const drawer = (state, sk) => ({
	draw: translateVector => {
		state.translateVector.x = -translateVector.x;
		state.translateVector.y = -translateVector.y;
		const players = state.players;
		if (Object.entries(players).length > 0) {
			for (const id of Object.keys(players)) {
				const player = players[id];

				if (player.alive && sk.socket.id !== player.id) {
					sk.push();
					sk.fill(player.color);
					sk.noStroke();
					sk.translate(state.translateVector.x, state.translateVector.y);
					sk.ellipse(player.position.x, player.position.y, player.size);
					sk.pop();
				}
			}
		}
	},
});

export default function PlayersConstructor(sk) {
	let state = {
		players: {},
		translateVector: { x: 0, y: 0 },
	};

	return Object.freeze({
		state,
		...playerSyncer(state),
		...remover(state),
		...drawer(state, sk),
		...createCollisionDetector(state),
		...playerKiller(state),
		...playerRemover(state),
		...playerMover(state),
		...positionGetter(state),
		...sizeSetter(state),
		...sizeGetter(state),
	});
}
