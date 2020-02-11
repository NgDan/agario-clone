class Players {
	constructor() {
		this.players = {};
	}
	update({ id, position, size }) {
		this.players[id] = { position: position, size: size };
	}

	remove(id) {
		delete this.players[id];
	}

	draw() {
		if (Object.entries(this.players).length > 0) {
			for (const player of Object.keys(this.players)) {
				// console.log();
				ellipse(
					this.players[player].position.x,
					this.players[player].position.y,
					this.players[player].size
				);
			}
		}
	}
}

// let updater = state => ({
// 	update: (id, position, size) => {
// 		state.players[id] == { position: position, size: size };
// 	}
// });
// let remover = state => ({
// 	remove: id => {
// 		delete state.players[id];
// 	}
// });
// let drawer = state => ({
// 	draw: () => {
// 		if (Object.entries(state.players).length > 0) {
// 			for (const player of Object.keys(state.players)) {
// 				ellipse(
// 					state.players[player].position.x,
// 					state.players[player].position.y,
// 					state.players[player].size
// 				);
// 			}
// 		}
// 	}
// });
// let PlayersConstructor = () => {
// 	let playersState = {
// 		players: {}
// 	};
// 	return {
// 		...updater(playersState),
// 		...removeListener(playersState),
// 		...drawer(playersState)
// 	};
// };
