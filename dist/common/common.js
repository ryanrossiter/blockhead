"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var ENTITIES = {
	ENTITY: 0,
	PHYSICS_ENTITY: 1,
	MOB: 2
};

var COLORS = {
	BACKGROUND: "#FCFCFD",
	PLAYER_NODE: "#abc9bd",
	ENEMY_NODE: "#d7a29e",
	NEUTRAL_NODE: "#D6E3F8",
	BULLET: "#CCADE6",
	LINE: "#9aa099",
	LINE_TEXT: "#666",
	LINE_INVALID: "#FF948D",
	BORDER: "#595a6d",
	TURRET: "#8A8B9A",

	TEXT: "#887",
	TEXT_FLASH: "#E33"
};

var KEYS = {
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	A: 65,
	S: 83,
	D: 68,
	W: 87,
	SPACE: 32
};

var DEFAULT_FONT = "14px Arial Black";
var WORLD_GRAVITY = {
	x: 0,
	y: 0
};

exports.ENTITIES = ENTITIES;
exports.COLORS = COLORS;
exports.KEYS = KEYS;
exports.DEFAULT_FONT = DEFAULT_FONT;