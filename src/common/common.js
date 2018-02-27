var ENTITIES = {
	ENTITY: 0,
	PHYSICS_ENTITY: 1,
	MOB: 2,
	PLAYER: 3,
	PROJECTILE: 4,
	ZOMBIE: 5,
	BARREL: 6,
	FLOATING_ITEM: 7
};

var ITEMS = {
	HANDGUN: 0,
	RIFLE: 1,
}

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
	TEXT_FLASH: "#E33",
};

var KEYS = {
	LEFT: 	37,
	UP: 	38,
	RIGHT: 	39,
	DOWN: 	40,
	A: 		65,
	S: 		83,
	D: 		68,
	W: 		87,
	SPACE:  32,
	E:      69,
	ONE:    49,
	TWO:    50,
	THREE:  51,
	FOUR:   52,
};

var DEFAULT_FONT = "14px Arial Black";
var WORLD_GRAVITY = {
	x: 0,
	y: 0
}

export default {
	ENTITIES,
	ITEMS,
	COLORS,
	KEYS,
	DEFAULT_FONT
}