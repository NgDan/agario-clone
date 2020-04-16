//atm

interface ServerFoodObject {
	x: number;
	y: number;
}

interface serverFood {
	food: ServerFoodObject;
	size: number;
	canvasDimensions: { x: number; y: number };
}
