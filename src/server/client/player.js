class Player {
	constructor(position, size, id = 0, socket) {
		this.id = id;
		this.size = size;
		this.speed = 2;
		this.position = position;
	}

	handleKeys() {
		if (keyIsDown(LEFT_ARROW)) {
			this.position.x = this.position.x - this.speed;
		}
		if (keyIsDown(RIGHT_ARROW)) {
			this.position.x = this.position.x + this.speed;
		}
		if (keyIsDown(UP_ARROW)) {
			this.position.y = this.position.y - this.speed;
		}
		if (keyIsDown(DOWN_ARROW)) {
			this.position.y = this.position.y + this.speed;
		}
		socket.emit('player-pos-and-size', {
			id: socket.id,
			position: this.position,
			size: this.size
		});
	}

	updatePosition(position) {
		this.position = position;
	}

	updateSize(size) {
		this.size += size;
	}
	draw() {
		push();
		fill('red');
		translate(initialPlayerPosition.x, initialPlayerPosition.y);
		translate(-this.position.x, -this.position.y);
		ellipse(this.position.x, this.position.y, this.size);
		fill('white');
		pop();
	}
}