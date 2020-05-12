import { initialPlayerPosition } from './constants';
export default class Player {
	constructor(position, size, id = 0, socket) {
		this.id = id;
		this.size = size;
		this.speed = 2;
		this.position = position;
	}

	handleKeys(sk, socket) {
		if (sk.keyIsDown(sk.LEFT_ARROW)) {
			this.position.x = this.position.x - this.speed;
		}
		if (sk.keyIsDown(sk.RIGHT_ARROW)) {
			this.position.x = this.position.x + this.speed;
		}
		if (sk.keyIsDown(sk.UP_ARROW)) {
			this.position.y = this.position.y - this.speed;
		}
		if (sk.keyIsDown(sk.DOWN_ARROW)) {
			this.position.y = this.position.y + this.speed;
		}
		socket.emit('player-pos-and-size', {
			id: socket.id,
			position: this.position,
			size: this.size,
		});
	}

	updatePosition(position) {
		this.position = position;
	}

	updateSize(size) {
		this.size += size;
	}

	draw(sk) {
		sk.push();
		sk.fill('red');
		sk.translate(initialPlayerPosition.x, initialPlayerPosition.y);
		sk.translate(-this.position.x, -this.position.y);
		sk.ellipse(this.position.x, this.position.y, this.size);
		sk.fill('white');
		sk.pop();
	}
}

const PlayerFactory = (position, size) => {
	let state = {
		id: id,
		size: size,
		speed: 2,
		position: position,
	};
};
