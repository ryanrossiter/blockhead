import io from "socket.io";
import Physics from '../../src/common/physics';
var socketio = io({
    "transports": ["websocket"],
    "log level": 1
});

global.window = {};

import Test1 from '../../src/common/maps/Test1';
import WorldBuilder from '../../src/common/maps/WorldBuilder';

import Mob from "../../src/common/entities/Mob";
import Player from "../../src/common/entities/Player";
import ZombieSpawner from "../../src/common/entities/ZombieSpawner";
import { ENTITIES } from "../../src/common/common";

import Matter from 'matter-js';

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

    init: function() {
        this.io = socketio.listen(PORT);
        this.io.sockets.on("connection", this.onSocketConnection.bind(this));

        Physics.CreateEngine(this);

        WorldBuilder.Build(Physics.engine.world, Test1);

        Core.entity.create(ZombieSpawner, {
            x: 30,
            y: 30,
        });

        Core.entity.create(ZombieSpawner, {
            x: -30,
            y: 30,
        });

        Core.entity.create(ZombieSpawner, {
            x: 30,
            y: -30,
        });

        Core.entity.create(ZombieSpawner, {
            x: -30,
            y: -30,
        });

        setInterval(this.update.bind(this), this.updateInterval);
        //setInterval(this.updateLeaderboard.bind(this), this.leaderboardUpdateInterssval);
        setInterval((function() {
            this.io.sockets.emit("game.update", this._getGameUpdateData());
        }).bind(this), this.gameUpdateBroadcastInterval);

        console.log(`Initialized server on port ${PORT}.`);
    },

    getUpdateDelta: function() {
        return Date.now() - this.lastUpdate;
    },

    update: function() {
        Matter.Engine.update(Physics.engine, this.getUpdateDelta());

        var updatedEntities = [];
        var deletedEntities = [];
        for (var id in this.entities) {
            if (this.entities.hasOwnProperty(id)) {
                var e = this.entities[id];
                if (e.update(this) && e.serverSideOnly === false) { // update returns true if the client should recieve an update
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

        this.lastUpdate = Date.now();
    },

    _getGameUpdateData: function() {
        return {
            leaderboard: this.leaderboard,
        };
    },

    // Establish event handlers here
    onSocketConnection: function(client) {
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
            playerNames: this.playerNames,
        });
        client.emit("game.update", this._getGameUpdateData());
        this.event.entity.updateAll.call(client, true);
    },

    // local entity functions
    entity: {
        createId: function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        },

        // Used locally
        create: function(klass, data) {
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

        _delete: function(ent) {
            ent.onDelete();
            delete Core.entities[ent.id];
        },

        delete: function(ent) {
            this._delete(ent);
            Core.io.sockets.emit("entity.delete", [ent.id]);
        },

        deleteAll: function(ents) {
            var es = [];
            for (var i = 0; i < ents.length; i++) {
                es.push(ents[i].id);
                this._delete(ents[i]);
            }

            Core.io.sockets.emit("entity.delete", es);
        },

        // Returns array of entities containing value for property
        findByProperty: function(property, value) {
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

        getAtPoint: function(x, y) {
            var es = [];
            for (var id in Core.entities) {
                if (Core.entities.hasOwnProperty(id)) {
                    var e = Core.entities[id];
                    if (e.pointIn(x,y)) es.push(e);
                }
            }

            return es;
        },

        getInRect: function(x0, y0, x1, y1) {
            var es = [];
            for (var id in Core.entities) {
                if (Core.entities.hasOwnProperty(id)) {
                    var e = Core.entities[id];
                    if (e.inRect(x0,y0,x1,y1)) es.push(e);
                }
            }

            return es;
        },
    },

    matterEvent: {
        // TODO: Move to common as the same code should be used in server + client
        collisionStart: function(event) {
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
        join: function(data) {
            if (Core.playerNames.hasOwnProperty(this.id)) return; // Don't allow multiple joins

            if (data && data.name) Core.playerNames[this.id] =
                data.name.length > MAX_NAME_LENGTH ? 
                data.name.substring(0, MAX_NAME_LENGTH) : 
                data.name;
            else Core.playerNames[this.id] = "UNNAMED";

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

            Core.entity.create(Player, {
                id: this.id,
                player: this.id,
                x: 0,//spawnX,
                y: 0,//spawnY,
            });
        },

        onClientDisconnect: function() {
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
            shoot: new function() {
                var shoot = function() {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].shoot = true;
                    }
                }

                shoot.stop = function() {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].shoot = false;
                    }
                }

                return shoot;
            },

            forward: new function() {
                var forward = function() {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].forward = true;
                    }
                }

                forward.stop = function() {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].forward = false;
                    }
                }

                return forward;
            },

            backward: new function() {
                var backward = function() {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].backward = true;
                    }
                }

                backward.stop = function() {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].backward = false;
                    }
                }

                return backward;
            },

            left: new function() {
                var left = function() {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].left = true;
                    }
                }

                left.stop = function() {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].left = false;
                    }
                }

                return left;
            },

            right: new function() {
                var right = function() {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].right = true;
                    }
                }

                right.stop = function() {
                    if (Core.entities.hasOwnProperty(this.id)) {
                        Core.entities[this.id].right = false;
                    }
                }

                return right;
            },
            angleFacing: function({ angle }) {
                if (Core.entities.hasOwnProperty(this.id)) {
                    Core.entities[this.id].angleFacing = angle;
                }
            }
        },

        entity: {
            updateAll: function(full) {
                var es = [];
                for (var id in Core.entities) {
                    if (Core.entities.hasOwnProperty(id) && Core.entities[id].serverSideOnly === false) {
                        es.push(Core.entities[id].toData(full)); // maybe only recreate data if it has changed?
                    }
                }

                this.emit("entity.update", es);
            },
        },
    },
}

Core.init();
export default Core;