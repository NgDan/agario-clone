let PlayersConstructor = () => {
	let playersState = {
		players: {},
		translateVector: { x: 0, y: 0 }
	};
	return Object.freeze({
		playersState,
		...updater(playersState),
		...remover(playersState),
		...drawer(playersState)
	});
};

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
	draw: translateVector => {
		state.translateVector.x = state.translateVector.x + translateVector.x;
		state.translateVector.y = state.translateVector.y + translateVector.y;
		console.log(state.translateVector);
		if (Object.entries(state.players).length > 0) {
			for (const player of Object.keys(state.players)) {
				push();
				translate(state.translateVector.x, state.translateVector.y);
				ellipse(
					state.players[player].position.x,
					state.players[player].position.y,
					state.players[player].size
				);
				pop();
			}
		}
	}
});
