const path = require('path');

module.exports = {
	entry: './src/sockets-service.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './dist'),
	},
	mode: 'none',
};
