export default class Food {
	constructor(food = [], size = 10) {
		this.food = food;
		this.size = size;
		this.translateVector = { x: 0, y: 0 };
	}
	setFood(food, size) {
		this.food = food;
		this.size = size;
	}

	collisionDetector(x, y, size, player, socket) {
		for (let id in this.food) {
			let piece = this.food[id];

			if (
				Math.pow(x - piece.x, 2) + Math.pow(y - piece.y, 2) <
				Math.pow(size / 2 + this.size / 2, 2)
			) {
				socket.emit('piece-eaten', id);
				delete this.food[id];
				player.updateSize(1);
			}
		}
	}

	deletePiece(id) {
		delete this.food[id];
	}

	translateFood(x, y, sk) {
		this.translateVector.x = -x;
		this.translateVector.y = -y;
		sk.translate(this.translateVector.x, this.translateVector.y);
	}

	draw(sk) {
		for (let item in this.food) {
			let piece = this.food[item];
			sk.ellipse(piece.x, piece.y, this.size);
		}
	}
}
