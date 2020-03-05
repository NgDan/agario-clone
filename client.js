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
	document.addEventListener('visibilitychange', function() {
		if (document.visibilityState === 'visible') {
			socket.emit('request-players');
		}
	});
}

function draw() {
	background(100);
	player.draw();
	player.handleKeys();
	players.draw(player.notifyChangesInPosition());
	// console.log(player.notifyChangesInPosition());
	food.translateFood(
		player.notifyChangesInPosition().x,
		player.notifyChangesInPosition().y
	);
	food.draw();
	food.collisionDetector(
		player.position.x,
		player.position.y,
		player.size,
		player
	);
}
