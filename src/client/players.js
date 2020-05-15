import { set } from 'lodash';

export default function PlayersConstructor(sk) {
	let playersState = {
		players: {},
		translateVector: { x: 0, y: 0 },
	};
	return Object.freeze({
		playersState,
		...updater(playersState),
		...remover(playersState),
		...drawer(playersState, sk),
	});
}

const updater = state => {
	console.log('state.players: ', state.players);
	return {
		update: ({ id, position, size }) => {
			if (position) {
				state.players[id] = { ...state.players[id], position: position };
			}
			if (size) {
				state.players[id] = { ...state.players[id], size: size };
			}
		},
	};
};

const remover = state => ({
	remove: id => {
		delete state.players[id];
	},
});

const drawer = (state, sk) => ({
	draw: translateVector => {
		state.translateVector.x = -translateVector.x;
		state.translateVector.y = -translateVector.y;
		const players = state.players;
		if (Object.entries(players).length > 0) {
			for (const player of Object.keys(players)) {
				sk.push();
				sk.translate(state.translateVector.x, state.translateVector.y);
				sk.ellipse(
					players[player].position.x,
					players[player].position.y,
					players[player].size
				);
				sk.pop();
			}
		}
	},
});
