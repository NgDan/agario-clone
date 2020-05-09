import { set } from 'lodash';

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
					Math.pow(size / 2 + this.size / 2, 2) &&
				this.food[id].active
			) {
				socket.emit('piece-eaten', id);
				this.food[id].active = false;
				player.updateSize(1);
			}
		}
	}

	deletePiece(id) {
		set(this, `food[${[id]}].active`, false);
	}

	translateFood(x, y, sk) {
		this.translateVector.x = -x;
		this.translateVector.y = -y;
		sk.translate(this.translateVector.x, this.translateVector.y);
	}

	draw(sk) {
		for (let item in this.food) {
			let piece = this.food[item];
			if (this.food[item].active) {
				sk.ellipse(piece.x, piece.y, this.size);
			}
		}
	}
}
