import { set } from 'lodash';
import areParticlesIntersected from '../helpers/areParticlesIntersected';

const updater = state => {
	return {
		update: ({ id, position, size, color, alive }) => {
			if (position) {
				state.players[id] = { ...state.players[id], position: position };
			}
			if (size) {
				state.players[id] = { ...state.players[id], size: size };
			}
			if (color) {
				state.players[id] = { ...state.players[id], color: color };
			}
			if (alive) {
				state.players[id] = { ...state.players[id], alive: alive };
			}
		},
	};
};

const remover = state => ({
	remove: id => {
		delete state.players[id];
	},
});

const createCollisionDetector = (state, sk) => ({
	playersCollisionDetector: (player, tolerance) => {
		const players = state.players;
		for (let id in players) {
			const remotePlayer = players[id];
			const particle1 = {
				id: player.id,
				x: player.position.x,
				y: player.position.y,
				size: player.size,
			};
			const particle2 = {
				id: id,
				x: remotePlayer.position.x,
				y: remotePlayer.position.y,
				size: remotePlayer.size,
			};
			if (
				areParticlesIntersected(particle1, particle2, tolerance) &&
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
		// console.log(state);
		state.translateVector.x = -translateVector.x;
		state.translateVector.y = -translateVector.y;
		const players = state.players;
		if (Object.entries(players).length > 0) {
			for (const id of Object.keys(players)) {
				const player = players[id];
				if (player.alive) {
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
		...updater(state),
		...remover(state),
		...drawer(state, sk),
		...createCollisionDetector(state),
	});
}
