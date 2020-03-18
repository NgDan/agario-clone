function setup() {
	socket = io();
	frameRate(60);
	createCanvas(800, 600);

	player = new Player(
		{ x: initialPlayerPosition.x, y: initialPlayerPosition.y },
		80
	);

	players = PlayersConstructor();
	console.log(players);
	food = new Food();

	socket.on('connect', () => {
		setTimeout(() => {
			socket.emit('request-food');
			socket.emit('request-players');
		}, 500);
	});

	socket.on('request-players', () => {
		console.log("player's position requested!");
		socket.emit('player-pos-and-size', {
			id: socket.id,
			position: player.position,
			size: player.size
		});
	});

	socket.on('send-food', foodFromServer => {
		food.setFood(foodFromServer.food, foodFromServer.size);
	});

	socket.on('piece-eaten', id => {
		food.deletePiece(id);
	});

	socket.on('broadcast', data => {
		players.update(data);
	});

	socket.on('user-disconnected', id => {
		players.remove(id);
	});
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible') {
			socket.emit('request-players');
		}
	});

	//temporary for development purposes
	document.querySelector('.request-food').addEventListener('click', () => {
		console.log('click');
		socket.emit('generate-food');
	});
}

// TODO: make translate func reusable
// TODO: refactor to es6
// DO measurements to get an idea of the bandwidth used when playing
// make player.position object consistent on both players and food
// implement "eat player functionality"
// zoom out when player grows

function draw() {
	background(100);
	player.draw();
	player.handleKeys();
	players.draw({
		x: player.position.x - initialPlayerPosition.x,
		y: player.position.y - initialPlayerPosition.y
	});
	food.translateFood(
		player.position.x - initialPlayerPosition.x,
		player.position.y - initialPlayerPosition.y
	);
	food.draw();
	food.collisionDetector(
		player.position.x,
		player.position.y,
		player.size,
		player
	);
}
