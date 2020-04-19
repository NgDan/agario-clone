/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _players__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _client_food__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);





let s = (sk) => {
	console.log(sk.translate);
	sk.setup = () => {
		console.log(io);
		sk.socket = io();
		sk.frameRate(60);
		sk.createCanvas(800, 600);

		sk.player = new _player__WEBPACK_IMPORTED_MODULE_2__["default"](
			{ x: _constants__WEBPACK_IMPORTED_MODULE_3__["initialPlayerPosition"].x, y: _constants__WEBPACK_IMPORTED_MODULE_3__["initialPlayerPosition"].y },
			80
		);

		sk.players = Object(_players__WEBPACK_IMPORTED_MODULE_0__["default"])(sk);

		sk.food = new _client_food__WEBPACK_IMPORTED_MODULE_1__["default"]();

		sk.socket.on('connect', () => {
			setTimeout(() => {
				sk.socket.emit('request-food');
				sk.socket.emit('request-players');
			}, 500);
		});

		sk.socket.on('request-players', () => {
			console.log("player's position requested!");
			sk.socket.emit('player-pos-and-size', {
				id: sk.socket.id,
				position: player.position,
				size: player.size,
			});
		});

		sk.socket.on('send-food', (foodFromServer) => {
			console.log('food shape: ', foodFromServer.food);
			sk.food.setFood(foodFromServer.food, foodFromServer.size);
		});

		sk.socket.on('piece-eaten', (id) => {
			sk.food.deletePiece(id);
		});

		sk.socket.on('broadcast', (data) => {
			players.update(data);
		});

		sk.socket.on('user-disconnected', (id) => {
			players.remove(id);
		});
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'visible') {
				sk.socket.emit('request-players');
			}
		});

		//temporary for development purposes
		document.querySelector('.request-food').addEventListener('click', () => {
			console.log('click');
			sk.socket.emit('generate-food');
		});
	};

	// TODO: make translate func reusable
	// TODO: refactor to es6
	// DO measurements to get an idea of the bandwidth used when playing
	// make player.position object consistent on both players and food
	// implement "eat player functionality"
	// zoom out when player grows

	sk.draw = () => {
		// update state, state = update(state)
		// render state, render(state)
		sk.background(100);
		sk.player.draw(sk);
		sk.player.handleKeys(sk, sk.socket);
		sk.players.draw({
			x: sk.player.position.x - _constants__WEBPACK_IMPORTED_MODULE_3__["initialPlayerPosition"].x,
			y: sk.player.position.y - _constants__WEBPACK_IMPORTED_MODULE_3__["initialPlayerPosition"].y,
		});
		sk.food.translateFood(
			sk.player.position.x - _constants__WEBPACK_IMPORTED_MODULE_3__["initialPlayerPosition"].x,
			sk.player.position.y - _constants__WEBPACK_IMPORTED_MODULE_3__["initialPlayerPosition"].y,
			sk
		);
		sk.food.draw(sk);
		sk.food.collisionDetector(
			sk.player.position.x,
			sk.player.position.y,
			sk.player.size,
			sk.player,
			sk.socket
		);
	};
};

const P5 = new p5(s);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PlayersConstructor; });
function PlayersConstructor(sk) {
	let playersState = {
		players: {},
		translateVector: { x: 0, y: 0 },
	};
	return Object.freeze({
		playersState,
		...updater(playersState),
		...remover(playersState),
		...drawer(playersState, sk.push, sk.translate, sk.ellipse, sk.pop),
	});
}

let updater = (state) => ({
	update: ({ id, position, size }) => {
		if (position) {
			state.players[id] = { ...state.players[id], position: position };
		}
		if (size) {
			state.players[id] = { ...state.players[id], size: size };
		}
	},
});
let remover = (state) => ({
	remove: (id) => {
		delete state.players[id];
	},
});
let drawer = (state, push, translate, ellipse, pop) => ({
	draw: (translateVector) => {
		state.translateVector.x = -translateVector.x;
		state.translateVector.y = -translateVector.y;
		if (Object.entries(state.players).length > 0) {
			for (const player of Object.keys(state.players)) {
				push();
				translate(state.translateVector.x, state.translateVector.y);
				ellipse(
					state.players[player].position.x,
					state.players[player].position.y,
					state.players[player].size
				);
				pop();
			}
		}
	},
});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Food; });
class Food {
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


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Player; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);

class Player {
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
		sk.translate(_constants__WEBPACK_IMPORTED_MODULE_0__["initialPlayerPosition"].x, _constants__WEBPACK_IMPORTED_MODULE_0__["initialPlayerPosition"].y);
		sk.translate(-this.position.x, -this.position.y);
		sk.ellipse(this.position.x, this.position.y, this.size);
		sk.fill('white');
		sk.pop();
	}
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initialPlayerPosition", function() { return initialPlayerPosition; });
const initialPlayerPosition = { x: 400, y: 300 };




/***/ })
/******/ ]);