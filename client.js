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

function setup() {
	socket = io();
	frameRate(60);
	createCanvas(800, 600);

	player = new Player({ x: 50, y: 50 }, 80);

	players = PlayersConstructor();
	console.log(players);
	food = new Food();

	socket.on('connect', function() {
		setTimeout(() => {
			socket.emit('request-food');
			socket.emit('request-players');
		}, 500);
	});

	socket.on('request-players', function() {
		console.log("player's position requested!");
		socket.emit('socketID', {
			id: socket.id,
			position: player.position,
			size: player.size
		});
	});

	socket.on('send-food', function(foodFromServer) {
		food.setFood(foodFromServer.food, foodFromServer.size);
	});

	socket.on('piece-eaten', function(id) {
		food.deletePiece(id);
	});

	socket.on('broadcast', function(data) {
		players.update(data);
	});

	socket.on('user-disconnected', function(id) {
		players.remove(id);
	});
}

function draw() {
	background(100);
	player.draw();
	player.handleKeys();
	players.draw();
	food.draw();
	food.collisionDetector(
		player.position.x,
		player.position.y,
		player.size,
		player
	);
}
