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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var ENTITIES = {
	ENTITY: 0,
	PHYSICS_ENTITY: 1,
	MOB: 2,
	PLAYER: 3,
	PROJECTILE: 4,
	ZOMBIE: 5
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

exports.default = {
	ENTITIES: ENTITIES,
	COLORS: COLORS,
	KEYS: KEYS,
	DEFAULT_FONT: DEFAULT_FONT
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var _arguments = arguments;
// ty to this dude: https://www.webreflection.co.uk/blog/2015/10/06/how-to-copy-objects-in-javascript
// preserves accessors
exports.default = {
    extend: function extend(target) {
        for (var hOP = Object.prototype.hasOwnProperty, copy = function copy(key) {
            if (!hOP.call(target, key)) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(this, key));
            }
        }, i = _arguments.length; 1 < i--; Object.keys(_arguments[i]).forEach(copy, _arguments[i])) {}
        return target;
    },

    // masks source1 with source2, result will be all of the properties in source1
    // with values replaced from source2 if it contains the property
    // if _protect: [property keys] is provided, then properties in source2 that are in _protect
    // will not be applied
    mask: function mask(source1, source2, excludeProtect) {
        var destination = {};
        var _protect = [];

        for (var property in source1) {
            if (source1.hasOwnProperty(property)) {
                if (property === "_protect") {
                    _protect = source1[property];
                    if (!excludeProtect) {
                        destination[property] = _protect.slice(); // make a copy
                    }
                } else {
                    destination[property] = source1[property];
                }
            }
        }

        for (var property in source2) {
            if (source1.hasOwnProperty(property) && _protect.indexOf(property) === -1 && property != "_protect") {
                // Changed from extend here (2 => 1)
                destination[property] = source2[property];
            }
        }

        return destination;
    },

    // Bind all functions in obj to scope
    bind: function bind(obj, scope) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && typeof obj[prop] === "function") {
                obj[prop] = obj[prop].bind(scope);
            }
        }

        return obj;
    },

    hashCode: function hashCode(str) {
        var hash = 0;
        if (str.length == 0) return hash;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(1);

var _helpers2 = _interopRequireDefault(_helpers);

var _PhysicsEntity2 = __webpack_require__(8);

var _PhysicsEntity3 = _interopRequireDefault(_PhysicsEntity2);

var _common = __webpack_require__(0);

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ENTITIES = _common2.default.ENTITIES;


var _data = Symbol('data');
var SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.MOB,
    health: 10,
    angleFacing: 0
};

var Mob = function (_PhysicsEntity) {
    _inherits(Mob, _PhysicsEntity);

    _createClass(Mob, [{
        key: 'type',
        get: function get() {
            return this[_data].type;
        }
    }, {
        key: 'angleFacing',
        get: function get() {
            return this[_data].angleFacing;
        },
        set: function set(angle) {
            if (this[_data].angleFacing !== angle) {
                this.needsUpdate = true;this[_data].angleFacing = angle;
            }
        }
    }, {
        key: 'health',
        get: function get() {
            return this[_data].health;
        },
        set: function set(health) {
            if (this[_data].health !== health) {
                this.needsUpdate = true;this[_data].health = health;
            }
        }
    }]);

    function Mob(data) {
        _classCallCheck(this, Mob);

        var _this = _possibleConstructorReturn(this, (Mob.__proto__ || Object.getPrototypeOf(Mob)).call(this, data));

        _this[_data] = _helpers2.default.mask(SCHEMA, data);
        return _this;
    }

    _createClass(Mob, [{
        key: 'update',
        value: function update(core) {
            var needsUpdate = _get(Mob.prototype.__proto__ || Object.getPrototypeOf(Mob.prototype), 'update', this).call(this, core);

            if (this.health <= 0) this.deleted = true;

            return needsUpdate;
        }
    }, {
        key: 'toData',
        value: function toData() {
            return Object.assign({}, _get(Mob.prototype.__proto__ || Object.getPrototypeOf(Mob.prototype), 'toData', this).call(this), _helpers2.default.mask(SCHEMA, this[_data], true));
        }
    }, {
        key: 'dataUpdate',
        value: function dataUpdate(data, now) {
            _get(Mob.prototype.__proto__ || Object.getPrototypeOf(Mob.prototype), 'dataUpdate', this).call(this, data, now);
            this[_data] = _helpers2.default.mask(this[_data], data);
        }
    }]);

    return Mob;
}(_PhysicsEntity3.default);

exports.default = Mob;
;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _socket = __webpack_require__(4);

var _socket2 = _interopRequireDefault(_socket);

var _physics = __webpack_require__(9);

var _physics2 = _interopRequireDefault(_physics);

var _Test = __webpack_require__(10);

var _Test2 = _interopRequireDefault(_Test);

var _WorldBuilder = __webpack_require__(13);

var _WorldBuilder2 = _interopRequireDefault(_WorldBuilder);

var _Mob = __webpack_require__(2);

var _Mob2 = _interopRequireDefault(_Mob);

var _Player = __webpack_require__(6);

var _Player2 = _interopRequireDefault(_Player);

var _Zombie = __webpack_require__(15);

var _Zombie2 = _interopRequireDefault(_Zombie);

var _common = __webpack_require__(0);

var _matterJs = __webpack_require__(7);

var _matterJs2 = _interopRequireDefault(_matterJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socketio = (0, _socket2.default)({
    "transports": ["websocket"],
    "log level": 1
});

global.window = {};

var MAX_NAME_LENGTH = 60;
const PORT = 8000;

const Core = {
    isClient: false,
    io: null,

    engine: null,

    lastUpdate: 0,
    updateInterval: 1000 / 20, // 20 tick
    leaderboardUpdateInterval: 3000,
    gameUpdateBroadcastInterval: 1000,
    entities: {},

    bounds: { x0: 0, y0: 0, x1: 3000, y1: 3000 },
    leaderboard: [], // Array containing {name, score} dicts

    playerNames: {},

    init: function () {
        this.io = socketio.listen(PORT);
        this.io.sockets.on("connection", this.onSocketConnection.bind(this));

        _physics2.default.CreateEngine(this);

        _WorldBuilder2.default.Build(_physics2.default.engine.world, _Test2.default);

        Core.entity.create(_Zombie2.default, {
            x: 15,
            y: 15
        });

        Core.entity.create(_Zombie2.default, {
            x: -15,
            y: 15
        });

        Core.entity.create(_Zombie2.default, {
            x: 15,
            y: -15
        });

        Core.entity.create(_Zombie2.default, {
            x: -15,
            y: -15
        });

        setInterval(this.update.bind(this), this.updateInterval);
        //setInterval(this.updateLeaderboard.bind(this), this.leaderboardUpdateInterssval);
        setInterval(function () {
            this.io.sockets.emit("game.update", this._getGameUpdateData());
        }.bind(this), this.gameUpdateBroadcastInterval);

        console.log(`Initialized server on port ${PORT}.`);
    },

    getUpdateDelta: function () {
        return Date.now() - this.lastUpdate;
    },

    update: function () {
        var updatedEntities = [];
        var deletedEntities = [];
        for (var id in this.entities) {
            if (this.entities.hasOwnProperty(id)) {
                var e = this.entities[id];
                if (e.update(this)) {
                    // update returns true if the client should recieve an update
                    e.needsUpdate = false;
                    updatedEntities.push(e.toData());
                }

                if (e.deleted) {
                    deletedEntities.push(e);
                }
            }
        }

        if (updatedEntities.length > 0) {
            this.io.sockets.emit("entity.update", updatedEntities);
        }

        if (deletedEntities.length > 0) {
            this.entity.deleteAll(deletedEntities);
        }

        _matterJs2.default.Engine.update(_physics2.default.engine, this.getUpdateDelta());
        this.lastUpdate = Date.now();
    },

    _getGameUpdateData: function () {
        return {
            leaderboard: this.leaderboard
        };
    },

    // Establish event handlers here
    onSocketConnection: function (client) {
        client.on("join", this.event.join);
        client.on("disconnect", this.event.onClientDisconnect);

        client.on("move.shoot", this.event.move.shoot);
        client.on("move.shoot.stop", this.event.move.shoot.stop);
        client.on("move.forward", this.event.move.forward);
        client.on("move.forward.stop", this.event.move.forward.stop);
        client.on("move.backward", this.event.move.backward);
        client.on("move.backward.stop", this.event.move.backward.stop);
        client.on("move.left", this.event.move.left);
        client.on("move.left.stop", this.event.move.left.stop);
        client.on("move.right", this.event.move.right);
        client.on("move.right.stop", this.event.move.right.stop);
        client.on("move.angleFacing", this.event.move.angleFacing);

        client.emit("init", {
            playerId: client.id,
            bounds: this.bounds,
            playerNames: this.playerNames
        });
        client.emit("game.update", this._getGameUpdateData());
        this.event.entity.updateAll.call(client, true);
    },

    // local entity functions
    entity: {
        createId: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        },

        // Used locally
        create: function (klass, data) {
            if (!data.id) {
                var id = this.createId();
                while (Core.entities.hasOwnProperty(id)) id = this.createId(); // ensure uniqueness
                data.id = id;
            }

            var e = new klass(Object.assign(data, ...arguments));
            Core.entities[e.id] = e;

            Core.io.sockets.emit("entity.update", [e.toData(true)]);

            return e;
        },

        _delete: function (ent) {
            ent.onDelete();
            delete Core.entities[ent.id];
        },

        delete: function (ent) {
            this._delete(ent);
            Core.io.sockets.emit("entity.delete", [ent.id]);
        },

        deleteAll: function (ents) {
            var es = [];
            for (var i = 0; i < ents.length; i++) {
                es.push(ents[i].id);
                this._delete(ents[i]);
            }

            Core.io.sockets.emit("entity.delete", es);
        },

        // Returns array of entities containing value for property
        findByProperty: function (property, value) {
            // Don't know why you'd do this but just in case
            if (property === "id") return [Core.entities[value]];

            var es = [];
            for (var id in Core.entities) {
                if (Core.entities.hasOwnProperty(id)) {
                    var e = Core.entities[id];
                    if (property in e && e[property] == value) {
                        es.push(e);
                    }
                }
            }

            return es;
        },

        getAtPoint: function (x, y) {
            var es = [];
            for (var id in Core.entities) {
                if (Core.entities.hasOwnProperty(id)) {
                    var e = Core.entities[id];
                    if (e.pointIn(x, y)) es.push(e);
                }
            }

            return es;
        },

        getInRect: function (x0, y0, x1, y1) {
            var es = [];
            for (var id in Core.entities) {
                if (Core.entities.hasOwnProperty(id)) {
                    var e = Core.entities[id];
                    if (e.inRect(x0, y0, x1, y1)) es.push(e);
                }
            }

            return es;
        }
    },

    matterEvent: {
        // TODO: Move to common as the same code should be used in server + client
        collisionStart: function (event) {
            for (var i = 0; i < event.pairs.length; i++) {
                var bodyA = event.pairs[i].bodyA;
                var bodyB = event.pairs[i].bodyB;
                // Find parent body, will contain the entityId
                while (bodyA.parent != bodyA) bodyA = bodyA.parent;
                while (bodyB.parent != bodyB) bodyB = bodyB.parent;

                if (bodyA.hasOwnProperty('entityId') && bodyB.hasOwnProperty('entityId')) {
                    var entityA = Core.entities[bodyA.entityId];
                    var entityB = Core.entities[bodyB.entityId];

                    if (entityA !== undefined && entityB !== undefined) {
                        entityA.onCollision(entityB, event.pairs[i], event.pairs[i].bodyA);
                        entityB.onCollision(entityA, event.pairs[i], event.pairs[i].bodyB);
                    }
                }
            }
        }
    },

    // socket-related functions
    // all functions in this object will be called in the socket event scope
    event: {
        join: function (data) {
            if (Core.playerNames.hasOwnProperty(this.id)) return; // Don't allow multiple joins

            if (data && data.name) Core.playerNames[this.id] = data.name.length > MAX_NAME_LENGTH ? data.name.substring(0, MAX_NAME_LENGTH) : data.name;else Core.playerNames[this.id] = "UNNAMED";

            console.log(`Player ${Core.playerNames[this.id]} (${this.request.connection.remoteAddress}) has joined.`);
            Core.io.sockets.emit("player.join", { id: this.id, name: Core.playerNames[this.id] });

            // locate a spawn point
            // var spawnX = 0, spawnY = 0;
            // var clear = false;
            // var spawnRange = 400;
            // var tries = 5;

            // while (!clear && (tries > 0 || Core.entity.getAtPoint(spawnX, spawnY).length > 0)) {
            //     spawnX = ~~(Math.random() * (Core.bounds.x1 - Core.bounds.x0) + Core.bounds.x0);
            //     spawnY = ~~(Math.random() * (Core.bounds.y1 - Core.bounds.y0) + Core.bounds.y0);

            //     clear = true;
            //     tries--;
            // }

            // if (tries <= 0) console.log("Ran out of tries, force spawning");

            Core.entity.create(_Player2.default, {
                id: this.id,
                player: this.id,
                x: 0, //spawnX,
                y: 0 //spawnY,
            });
        },

        onClientDisconnect: function () {
            if (Core.playerNames.hasOwnProperty(this.id)) {
                console.log("Player " + Core.playerNames[this.id] + " has disconnected.");

                // Remove entities belonging to the player
                var playerNodes = Core.entity.findByProperty("player", this.id);
                Core.entity.deleteAll(playerNodes);

                // Remove player's name from playerNames array
                delete Core.playerNames[this.id];
                Core.io.sockets.emit("player.leave", this.id);
            }
        },

        move: {
            shoot: new function () {
                var shoot = function () {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].shoot = true;
                    }
                };

                shoot.stop = function () {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].shoot = false;
                    }
                };

                return shoot;
            }(),

            forward: new function () {
                var forward = function () {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].forward = true;
                    }
                };

                forward.stop = function () {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].forward = false;
                    }
                };

                return forward;
            }(),

            backward: new function () {
                var backward = function () {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].backward = true;
                    }
                };

                backward.stop = function () {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].backward = false;
                    }
                };

                return backward;
            }(),

            left: new function () {
                var left = function () {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].left = true;
                    }
                };

                left.stop = function () {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].left = false;
                    }
                };

                return left;
            }(),

            right: new function () {
                var right = function () {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].right = true;
                    }
                };

                right.stop = function () {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].right = false;
                    }
                };

                return right;
            }(),
            angleFacing: function (_ref) {
                let { angle } = _ref;

                if (Core.entities.hasOwnProperty(this.id)) {
                    Core.entities[this.id].angleFacing = angle;
                }
            }
        },

        entity: {
            updateAll: function (full) {
                var es = [];
                for (var id in Core.entities) {
                    if (Core.entities.hasOwnProperty(id)) {
                        es.push(Core.entities[id].toData(full)); // maybe only recreate data if it has changed?
                    }
                }

                this.emit("entity.update", es);
            }
        }
    }
};

Core.init();
exports.default = Core;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(1);

var _helpers2 = _interopRequireDefault(_helpers);

var _common = __webpack_require__(0);

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ENTITIES = _common2.default.ENTITIES;


var _data = Symbol('data');
var SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.ENTITY,
    id: undefined,
    player: null,
    x: 0,
    y: 0,
    w: 3,
    h: 3
};

var Entity = function () {
    function Entity(data) {
        _classCallCheck(this, Entity);

        this[_data] = _helpers2.default.mask(SCHEMA, data);
        // protect the id once it's set, not really necessary but a neat feature
        this[_data]._protect.push('id');

        this.hashCode = _helpers2.default.hashCode(this.id);
        this.needsUpdate = true; // Start with updating the clients
        this.deleted = false;

        if (this[_data].w === -1 || this[_data].h === -1) {
            this[_data].w = this[_data].h = this[_data].r * 2;
        }
    }

    _createClass(Entity, [{
        key: 'setPos',
        value: function setPos(newX, newY) {
            this[_data].x = newX;
            this[_data].y = newY;
        }
    }, {
        key: 'move',
        value: function move(dx, dy) {
            setPos.call(this, this[_data].x + dx, this[_data].y + dy);
        }
    }, {
        key: 'update',
        value: function update(core) {
            return this.needsUpdate;
        }
    }, {
        key: 'clientUpdate',
        // returns true if we need to send an update to the client.

        value: function clientUpdate() {}
    }, {
        key: 'toData',


        // full used in cases where changes are usually sent in segments but the full data needs to be sent (first update)
        value: function toData(full) {
            return _helpers2.default.mask(SCHEMA, this[_data], true);
        }
    }, {
        key: 'dataUpdate',
        value: function dataUpdate(data, now) {
            this[_data] = _helpers2.default.mask(this[_data], data);
        }
    }, {
        key: 'onDelete',
        value: function onDelete() {}
    }, {
        key: 'id',
        get: function get() {
            return this[_data].id;
        }
    }, {
        key: 'type',
        get: function get() {
            return this[_data].type;
        }
    }, {
        key: 'player',
        get: function get() {
            return this[_data].player;
        },
        set: function set(p) {
            this.needsUpdate = true;this[_data].player = p;
        }
    }, {
        key: 'x',
        get: function get() {
            return this[_data].x;
        },
        set: function set(x) {
            this.needsUpdate = true;this[_data].x = x;
        }
    }, {
        key: 'y',
        get: function get() {
            return this[_data].y;
        },
        set: function set(y) {
            this.needsUpdate = true;this[_data].y = y;
        }
    }, {
        key: 'w',
        get: function get() {
            return this[_data].w;
        },
        set: function set(w) {
            this.needsUpdate = true;this[_data].w = w;
        }
    }, {
        key: 'h',
        get: function get() {
            return this[_data].h;
        },
        set: function set(h) {
            this.needsUpdate = true;this[_data].h = h;
        }
    }]);

    return Entity;
}();

exports.default = Entity;
;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(1);

var _helpers2 = _interopRequireDefault(_helpers);

var _Mob2 = __webpack_require__(2);

var _Mob3 = _interopRequireDefault(_Mob2);

var _Projectile = __webpack_require__(14);

var _Projectile2 = _interopRequireDefault(_Projectile);

var _common = __webpack_require__(0);

var _common2 = _interopRequireDefault(_common);

var _matterJs = __webpack_require__(7);

var _matterJs2 = _interopRequireDefault(_matterJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ENTITIES = _common2.default.ENTITIES;


var _data = Symbol('data');
var SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.PLAYER,
    forward: false,
    backward: false,
    left: false,
    right: false,
    shoot: false
};

var ACCELERATION = 0.1;
var SHOOT_DELAY = 200;
var PROJECTILE_SPEED = 2;

var Player = function (_Mob) {
    _inherits(Player, _Mob);

    _createClass(Player, [{
        key: 'type',
        get: function get() {
            return this[_data].type;
        }
    }, {
        key: 'shoot',
        get: function get() {
            return this[_data].shoot;
        },
        set: function set(s) {
            if (this[_data].shoot !== s) {
                this.needsUpdate = true;this[_data].shoot = s;
            }
        }
    }, {
        key: 'forward',
        get: function get() {
            return this[_data].forward;
        },
        set: function set(f) {
            if (this[_data].forward !== f) {
                this.needsUpdate = true;this[_data].forward = f;this._forward();
            }
        }
    }, {
        key: 'backward',
        get: function get() {
            return this[_data].backward;
        },
        set: function set(b) {
            if (this[_data].backward !== b) {
                this.needsUpdate = true;this[_data].backward = b;this._backward();
            }
        }
    }, {
        key: 'left',
        get: function get() {
            return this[_data].left;
        },
        set: function set(l) {
            if (this[_data].left !== l) {
                this.needsUpdate = true;this[_data].left = l;this._left();
            }
        }
    }, {
        key: 'right',
        get: function get() {
            return this[_data].right;
        },
        set: function set(r) {
            if (this[_data].right !== r) {
                this.needsUpdate = true;this[_data].right = r;this._right();
            }
        }
    }]);

    function Player(data) {
        _classCallCheck(this, Player);

        var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, data));

        _this[_data] = _helpers2.default.mask(SCHEMA, data);

        _this.shootTimer = 0;
        return _this;
    }

    _createClass(Player, [{
        key: 'update',
        value: function update(core) {
            var needsUpdate = _get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'update', this).call(this, core);

            if (this.shootTimer > 0) this.shootTimer -= core.getUpdateDelta();

            if (this[_data].shoot === true && this.shootTimer <= 0) {
                this._shoot(core);
                this.shootTimer = SHOOT_DELAY;
            }

            if (this[_data].forward === true) {
                this._forward();
            }

            if (this[_data].backward === true) {
                this._backward();
            }

            if (this[_data].left === true) {
                this._left();
            }

            if (this[_data].right === true) {
                this._right();
            }

            return needsUpdate;
        }
    }, {
        key: '_shoot',
        value: function _shoot(core) {
            core.entity.create(_Projectile2.default, {
                player: this.player,
                x: this.x,
                y: this.y,
                xVelocity: Math.cos(this.angleFacing) * PROJECTILE_SPEED,
                yVelocity: Math.sin(this.angleFacing) * PROJECTILE_SPEED
            });
        }
    }, {
        key: '_left',
        value: function _left() {
            _matterJs2.default.Body.setVelocity(this.body, {
                x: this.body.velocity.x - ACCELERATION,
                y: this.body.velocity.y
            });
        }
    }, {
        key: '_right',
        value: function _right() {
            _matterJs2.default.Body.setVelocity(this.body, {
                x: this.body.velocity.x + ACCELERATION,
                y: this.body.velocity.y
            });
        }
    }, {
        key: '_forward',
        value: function _forward() {
            _matterJs2.default.Body.setVelocity(this.body, {
                x: this.body.velocity.x,
                y: this.body.velocity.y + ACCELERATION
            });
        }
    }, {
        key: '_backward',
        value: function _backward() {
            _matterJs2.default.Body.setVelocity(this.body, {
                x: this.body.velocity.x,
                y: this.body.velocity.y - ACCELERATION
            });
        }
    }, {
        key: 'toData',
        value: function toData() {
            return Object.assign({}, _get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'toData', this).call(this), _helpers2.default.mask(SCHEMA, this[_data], true));
        }
    }, {
        key: 'dataUpdate',
        value: function dataUpdate(data, now) {
            _get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'dataUpdate', this).call(this, data, now);
            this[_data] = _helpers2.default.mask(this[_data], data);
        }
    }]);

    return Player;
}(_Mob3.default);

exports.default = Player;
;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("matter-js");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(1);

var _helpers2 = _interopRequireDefault(_helpers);

var _Entity2 = __webpack_require__(5);

var _Entity3 = _interopRequireDefault(_Entity2);

var _common = __webpack_require__(0);

var _common2 = _interopRequireDefault(_common);

var _matterJs = __webpack_require__(7);

var _matterJs2 = _interopRequireDefault(_matterJs);

var _physics = __webpack_require__(9);

var _physics2 = _interopRequireDefault(_physics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ENTITIES = _common2.default.ENTITIES;


var _data = Symbol('data');
var SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.PHYSICS_ENTITY,
    xVelocity: 0,
    yVelocity: 0,
    angularVelocity: 0,
    angle: 0,
    lastUpdate: 0
};

var PhysicsEntity = function (_Entity) {
    _inherits(PhysicsEntity, _Entity);

    _createClass(PhysicsEntity, [{
        key: 'type',
        get: function get() {
            return this[_data].type;
        }
    }, {
        key: 'angle',
        get: function get() {
            return this[_data].angle;
        }
    }]);

    function PhysicsEntity(data) {
        _classCallCheck(this, PhysicsEntity);

        var _this = _possibleConstructorReturn(this, (PhysicsEntity.__proto__ || Object.getPrototypeOf(PhysicsEntity)).call(this, data));

        _this[_data] = _helpers2.default.mask(SCHEMA, Object.assign({}, {
            lastUpdate: Date.now()
        }, data));

        _this.setBody(_this.createBody());
        return _this;
    }

    _createClass(PhysicsEntity, [{
        key: 'createBody',
        value: function createBody() {
            var body = new _matterJs2.default.Bodies.circle(this.x, this.y, this.w / 2);
            body.friction = 0.0;
            body.frictionAir = 0.2;
            return body;
        }
    }, {
        key: 'update',
        value: function update(core) {
            var needsUpdate = _get(PhysicsEntity.prototype.__proto__ || Object.getPrototypeOf(PhysicsEntity.prototype), 'update', this).call(this, core);

            if (_get(PhysicsEntity.prototype.__proto__ || Object.getPrototypeOf(PhysicsEntity.prototype), 'x', this) != this.body.position.x) {
                needsUpdate |= true;
                _set(PhysicsEntity.prototype.__proto__ || Object.getPrototypeOf(PhysicsEntity.prototype), 'x', this.body.position.x, this);
            }

            if (_get(PhysicsEntity.prototype.__proto__ || Object.getPrototypeOf(PhysicsEntity.prototype), 'y', this) != this.body.position.y) {
                needsUpdate |= true;
                _set(PhysicsEntity.prototype.__proto__ || Object.getPrototypeOf(PhysicsEntity.prototype), 'y', this.body.position.y, this);
            }

            if (this[_data].xVelocity != this.body.velocity.x) {
                needsUpdate |= true;
                this[_data].xVelocity = this.body.velocity.x;
            }

            if (this[_data].yVelocity != this.body.velocity.y) {
                needsUpdate |= true;
                this[_data].yVelocity = this.body.velocity.y;
            }

            if (this[_data].angle != this.body.angle) {
                needsUpdate |= true;
                this[_data].angle = this.body.angle;
            }

            if (this[_data].angularVelocity != this.body.angularVelocity) {
                needsUpdate |= true;
                this[_data].angularVelocity = this.body.angularVelocity;
            }

            if (needsUpdate == true) {
                this[_data].lastUpdate = Date.now();
            }

            return needsUpdate;
        }
    }, {
        key: 'onCollision',
        value: function onCollision(entity, pair, body) {}
    }, {
        key: 'toData',
        value: function toData() {
            return Object.assign({}, _get(PhysicsEntity.prototype.__proto__ || Object.getPrototypeOf(PhysicsEntity.prototype), 'toData', this).call(this), _helpers2.default.mask(SCHEMA, this[_data], true));
        }
    }, {
        key: 'dataUpdate',
        value: function dataUpdate(data, now) {
            _get(PhysicsEntity.prototype.__proto__ || Object.getPrototypeOf(PhysicsEntity.prototype), 'dataUpdate', this).call(this, data);
            this[_data] = _helpers2.default.mask(this[_data], data);

            var delay = 0;
            var xVelCorr = 0;
            var yVelCorr = 0;
            var angleVelCorr = 0;
            if (this.lastBodyUpdate !== null) {
                delay = now - this[_data].lastUpdate;
                var delta = Date.now() + delay - this.lastBodyUpdate;

                xVelCorr = (_get(PhysicsEntity.prototype.__proto__ || Object.getPrototypeOf(PhysicsEntity.prototype), 'x', this) - this.body.position.x) / (delta / (1000 / 60));
                yVelCorr = (_get(PhysicsEntity.prototype.__proto__ || Object.getPrototypeOf(PhysicsEntity.prototype), 'y', this) - this.body.position.y) / (delta / (1000 / 60));
                angleVelCorr = (this[_data].angle - this.body.angle) / (delta / (1000 / 60));
            }

            this.lastBodyUpdate = Date.now() + delay;
            //console.log(`${this.body.velocity.x} ${this[_data].xVelocity} ${this.body.position.x} ${super.x} ${xVelCorr}`);
            //console.log("aa", xVelCorr);
            _matterJs2.default.Body.setVelocity(this.body, { x: this[_data].xVelocity + xVelCorr, y: this[_data].yVelocity + yVelCorr });
            _matterJs2.default.Body.setAngularVelocity(this.body, this[_data].angularVelocity + angleVelCorr);
            //Matter.Body.setPosition(this.body, { x: super.x, y: super.y });
            //Matter.Body.setAngle(this.body, this[_data].angle);
        }
    }, {
        key: 'setBody',
        value: function setBody(body) {
            _matterJs2.default.Body.set(body, {
                position: { x: this.x, y: this.y },
                angle: this[_data].angle
            });
            _matterJs2.default.Body.setVelocity(body, { x: this[_data].xVelocity, y: this[_data].yVelocity });
            _matterJs2.default.Body.setAngularVelocity(body, this[_data].angularVelocity);

            this.body = body;
            this.body.entityId = this.id;
            this.lastBodyUpdate = Date.now();
            _matterJs2.default.World.add(_physics2.default.engine.world, this.body);
        }
    }, {
        key: 'onDelete',
        value: function onDelete() {
            _matterJs2.default.Composite.remove(_physics2.default.engine.world, this.body);
        }
    }]);

    return PhysicsEntity;
}(_Entity3.default);

exports.default = PhysicsEntity;
;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _matterJs = __webpack_require__(7);

var _matterJs2 = _interopRequireDefault(_matterJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    engine: null,
    onCollision: function onCollision(pair, bodyA, bodyB) {
        if (bodyA.hasOwnProperty('entityId') || bodyB.hasOwnProperty('entityId')) {
            var entityA = bodyA.entityId ? this.entities[bodyA.entityId] : null;
            var entityB = bodyB.entityId ? this.entities[bodyB.entityId] : null;

            if (entityA) {
                entityA.onCollision(entityB, pair, pair.bodyA);
            }

            if (entityB) {
                entityB.onCollision(entityA, pair, pair.bodyB);
            }
        }
    },

    CreateEngine: function CreateEngine(core) {
        var _this = this;

        this.engine = _matterJs2.default.Engine.create();
        this.engine.world.gravity.y = 0;

        this.onCollision = this.onCollision.bind(core);
        _matterJs2.default.Events.on(this.engine, "collisionStart", function (event) {
            for (var i = 0; i < event.pairs.length; i++) {
                var bodyA = event.pairs[i].bodyA;
                var bodyB = event.pairs[i].bodyB;
                // Find parent body, will contain the entityId
                while (bodyA.parent != bodyA) {
                    bodyA = bodyA.parent;
                }while (bodyB.parent != bodyB) {
                    bodyB = bodyB.parent;
                }_this.onCollision(event.pairs[i], bodyA, bodyB);
            }
        });
    }
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _helpers = __webpack_require__(11);

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Test1 = {
    objQueue: []

    // border walls
};_helpers2.default.GenerateWall(Test1, 0, 50, 102, 2);
_helpers2.default.GenerateWall(Test1, 50, 0, 2, 102);
_helpers2.default.GenerateWall(Test1, 0, -50, 102, 2);
_helpers2.default.GenerateWall(Test1, -50, 0, 2, 102);

_helpers2.default.GenerateWall(Test1, 0, 10, 10, 2);
_helpers2.default.GenerateWall(Test1, 10, 0, 2, 10);
_helpers2.default.GenerateWall(Test1, 0, -10, 10, 2);
_helpers2.default.GenerateWall(Test1, -10, 0, 2, 10);

exports.default = Test1;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    GenerateWall: function GenerateWall(map, x, y, w, h) {
        map.objQueue.push({
            name: "rectangle",
            x: x, y: y, w: w, h: h, zHeight: 7,
            color: 0x101010
        });
    }
};

/***/ }),
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _matterJs = __webpack_require__(7);

var _matterJs2 = _interopRequireDefault(_matterJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    Build: function Build(world, map) {
        for (var i = 0; i < map.objQueue.length; i++) {
            var body = null;
            var _map$objQueue$i = map.objQueue[i],
                name = _map$objQueue$i.name,
                x = _map$objQueue$i.x,
                y = _map$objQueue$i.y,
                w = _map$objQueue$i.w,
                h = _map$objQueue$i.h;

            if (name === "rectangle") {
                body = new _matterJs2.default.Bodies.rectangle(x, y, w, h);
            }

            if (body) {
                _matterJs2.default.Body.setStatic(body, true);
                _matterJs2.default.World.add(world, body);
            }
        }
    }
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(1);

var _helpers2 = _interopRequireDefault(_helpers);

var _PhysicsEntity2 = __webpack_require__(8);

var _PhysicsEntity3 = _interopRequireDefault(_PhysicsEntity2);

var _Mob = __webpack_require__(2);

var _Mob2 = _interopRequireDefault(_Mob);

var _common = __webpack_require__(0);

var _common2 = _interopRequireDefault(_common);

var _matterJs = __webpack_require__(7);

var _matterJs2 = _interopRequireDefault(_matterJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ENTITIES = _common2.default.ENTITIES;


var _data = Symbol('data');
var SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.PROJECTILE
};

var DEFAULT_LIFETIME = 1000;

var Projectile = function (_PhysicsEntity) {
    _inherits(Projectile, _PhysicsEntity);

    _createClass(Projectile, [{
        key: 'type',
        get: function get() {
            return this[_data].type;
        }
    }]);

    function Projectile(data) {
        _classCallCheck(this, Projectile);

        var _this = _possibleConstructorReturn(this, (Projectile.__proto__ || Object.getPrototypeOf(Projectile)).call(this, Object.assign({}, data, {
            w: data.w || 2,
            h: data.h || 2
        })));

        _this[_data] = _helpers2.default.mask(SCHEMA, data);

        _this.body.frictionAir = 0.01;
        _this.body.restitution = 0.9;

        _this.lifetime = DEFAULT_LIFETIME;
        return _this;
    }

    _createClass(Projectile, [{
        key: 'onCollision',
        value: function onCollision(entity, pair) {
            if (entity && entity.player === this.player) {
                _matterJs2.default.Pair.setActive(pair, false);
            } else {
                if (entity && entity instanceof _Mob2.default) {
                    entity.health = entity.health - 1;
                }
                this.deleted = true;
            }
        }
    }, {
        key: 'update',
        value: function update(core) {
            var needsUpdate = _get(Projectile.prototype.__proto__ || Object.getPrototypeOf(Projectile.prototype), 'update', this).call(this, core);

            this.lifetime -= core.getUpdateDelta();
            if (this.lifetime <= 0) {
                this.deleted = true;
            }

            return needsUpdate;
        }
    }, {
        key: 'toData',
        value: function toData() {
            return Object.assign({}, _get(Projectile.prototype.__proto__ || Object.getPrototypeOf(Projectile.prototype), 'toData', this).call(this), _helpers2.default.mask(SCHEMA, this[_data], true));
        }
    }, {
        key: 'dataUpdate',
        value: function dataUpdate(data, now) {
            _get(Projectile.prototype.__proto__ || Object.getPrototypeOf(Projectile.prototype), 'dataUpdate', this).call(this, data, now);
            this[_data] = _helpers2.default.mask(this[_data], data);
        }
    }]);

    return Projectile;
}(_PhysicsEntity3.default);

exports.default = Projectile;
;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(1);

var _helpers2 = _interopRequireDefault(_helpers);

var _Mob2 = __webpack_require__(2);

var _Mob3 = _interopRequireDefault(_Mob2);

var _common = __webpack_require__(0);

var _common2 = _interopRequireDefault(_common);

var _matterJs = __webpack_require__(7);

var _matterJs2 = _interopRequireDefault(_matterJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ENTITIES = _common2.default.ENTITIES;


var _data = Symbol('data');
var SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.ZOMBIE
};

var ACCELERATION = 0.03;
var TARGET_DELAY = 500;

var Zombie = function (_Mob) {
    _inherits(Zombie, _Mob);

    _createClass(Zombie, [{
        key: 'type',
        get: function get() {
            return this[_data].type;
        }
    }]);

    function Zombie(data) {
        _classCallCheck(this, Zombie);

        var _this = _possibleConstructorReturn(this, (Zombie.__proto__ || Object.getPrototypeOf(Zombie)).call(this, data));

        _this[_data] = _helpers2.default.mask(SCHEMA, data);
        _this.targetEntity = null;
        _this.targetTimer = 0;
        return _this;
    }

    _createClass(Zombie, [{
        key: 'onCollision',
        value: function onCollision(entity, pair) {
            // if (entity && entity) {
            //     Matter.Pair.setActive(pair, false);
            // } else {
            //     this.deleted = true;
            // }
        }
    }, {
        key: 'update',
        value: function update(core) {
            var needsUpdate = _get(Zombie.prototype.__proto__ || Object.getPrototypeOf(Zombie.prototype), 'update', this).call(this, core);

            if (this.targetEntity) {
                var dX = this.targetEntity.x - this.x;
                var dY = this.targetEntity.y - this.y;
                this.angleFacing = Math.atan(dY / dX) + (dX < 0 ? Math.PI : 0);

                var v = _matterJs2.default.Vector.normalise({ x: dX, y: dY });
                _matterJs2.default.Body.setVelocity(this.body, {
                    x: this.body.velocity.x + v.x * ACCELERATION,
                    y: this.body.velocity.y + v.y * ACCELERATION
                });
            }

            if (this.targetTimer <= 0) {
                var playerId = Object.keys(core.playerNames)[0];
                if (playerId) this.targetEntity = core.entities[playerId];
            } else this.targetTimer -= core.getUpdateDelta();

            return needsUpdate;
        }
    }, {
        key: 'toData',
        value: function toData() {
            return Object.assign({}, _get(Zombie.prototype.__proto__ || Object.getPrototypeOf(Zombie.prototype), 'toData', this).call(this), _helpers2.default.mask(SCHEMA, this[_data], true));
        }
    }, {
        key: 'dataUpdate',
        value: function dataUpdate(data, now) {
            _get(Zombie.prototype.__proto__ || Object.getPrototypeOf(Zombie.prototype), 'dataUpdate', this).call(this, data, now);
            this[_data] = _helpers2.default.mask(this[_data], data);
        }
    }]);

    return Zombie;
}(_Mob3.default);

exports.default = Zombie;
;

/***/ })
/******/ ]);