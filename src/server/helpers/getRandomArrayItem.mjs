export default function getRandomArrayItem(colorsArray) {
	return colorsArray[Math.ceil(Math.random() * colorsArray.length - 1)];
}
