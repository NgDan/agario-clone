import set from 'lodash';

class Food {
	constructor(canvasDimensions, size) {
		this.food = {};
		this.size = size;
		this.canvasDimensions = canvasDimensions;
	}
	generate(numberOfPieces) {
		for (let i = 0; i < numberOfPieces; i++) {
			let x = Math.floor(Math.random() * this.canvasDimensions.x);
			let y = Math.floor(Math.random() * this.canvasDimensions.y);
			let id = '' + x + y;

			this.food[id] = { x: x, y: y, active: true };
		}
	}
	deletePiece(id) {
		set(this, `food[${[id]}].active`, false);
	}
}

export default Food;
