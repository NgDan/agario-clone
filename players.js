let updater = state => ({
	update: ({ id, position, size }) => {
		if (position) {
			state.players[id] = { ...state.players[id], position: position };
		}
		if (size) {
			state.players[id] = { ...state.players[id], size: size };
		}
	}
});
let remover = state => ({
	remove: id => {
		delete state.players[id];
	}
});
let drawer = state => ({
	draw: () => {
		if (Object.entries(state.players).length > 0) {
			for (const player of Object.keys(state.players)) {
				ellipse(
					state.players[player].position.x,
					state.players[player].position.y,
					state.players[player].size
				);
			}
		}
	}
});
let PlayersConstructor = () => {
	let playersState = {
		players: {}
	};
	return Object.freeze({
		playersState,
		...updater(playersState),
		...remover(playersState),
		...drawer(playersState)
	});
};
