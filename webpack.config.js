const path = require('path');

module.exports = {
	entry: './src/client/client.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './src/client/dist'),
	},
	mode: 'none',
};
