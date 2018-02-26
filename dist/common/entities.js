"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EntityFactory = undefined;

var _common = require("./common");

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENTITIES = _common2.default.ENTITIES;

// ty to this dude: https://www.webreflection.co.uk/blog/2015/10/06/how-to-copy-objects-in-javascript
// preserves accessors

Object.extend = function (target) {
    for (var hOP = Object.prototype.hasOwnProperty, copy = function copy(key) {
        if (!hOP.call(target, key)) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(this, key));
        }
    }, i = arguments.length; 1 < i--; Object.keys(arguments[i]).forEach(copy, arguments[i])) {}
    return target;
};

// masks source1 with source2, result will be all of the properties in source1
// with values replaced from source2 if it contains the property
// if _protect: [property keys] is provided, then properties in source2 that are in _protect
// will not be applied
Object.mask = function (source1, source2, excludeProtect) {
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
};

// Bind all functions in obj to scope
Object.bind = function (obj, scope) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop) && typeof obj[prop] === "function") {
            obj[prop] = obj[prop].bind(scope);
        }
    }

    return obj;
};

var Entity = new function () {
    var SCHEMA = {
        _protect: ['type'],
        type: ENTITIES.ENTITY,
        id: undefined,
        player: null,
        x: 0,
        y: 0
    };

    var setPos = function setPos(newX, newY) {
        this.data.x = newX;
        this.data.y = newY;
    };

    var move = function move(dx, dy) {
        setPos.call(this, this.data.x + dx, this.data.y + dy);
    };

    var update = function update(core) {
        return this.needsUpdate;
    }; // returns true if we need to send an update to the client.

    var clientUpdate = function clientUpdate() {};

    var isType = function isType(type) {
        return type === this.data.type;
    };

    // full used in cases where changes are usually sent in segments but the full data needs to be sent (first update)
    var toData = function toData(full) {
        return Object.mask(SCHEMA, this.data, true);
    };

    var dataUpdate = function dataUpdate(data) {
        this.data = Object.mask(this.data, data);
    };

    var onDelete = function onDelete() {};

    return function (data) {
        this.data = Object.mask(SCHEMA, data);
        // protect the id once it's set, not really necessary but a neat feature
        this.data._protect.push('id');

        this.needsUpdate = true; // Start with updating the clients
        this.deleted = false;

        if (this.data.w === -1 || this.data.h === -1) {
            this.data.w = this.data.h = this.data.r * 2;
        }

        var scope = this;
        return Object.extend({}, Object.bind({
            toData: toData,
            dataUpdate: dataUpdate,
            isType: isType,
            setPos: setPos,
            move: move,
            update: update,
            clientUpdate: clientUpdate,
            onDelete: onDelete
        }, this), {
            get id() {
                return scope.data.id;
            },
            get type() {
                return scope.data.type;
            },
            get player() {
                return scope.data.player;
            },
            set player(p) {
                scope.needsUpdate = true;scope.data.player = p;
            },
            get x() {
                return scope.data.x;
            },
            get y() {
                return scope.data.y;
            },
            set x(x) {
                scope.needsUpdate = true;scope.data.x = x;
            },
            set y(y) {
                scope.needsUpdate = true;scope.data.y = y;
            },
            set needsUpdate(n) {
                scope.needsUpdate = n;
            },
            get deleted() {
                return scope.deleted;
            },
            set deleted(d) {
                scope.deleted = d;
            }
        });
    };
}();

var PhysicsEntity = new function () {
    var SCHEMA = {
        _protect: ['type'],
        type: ENTITIES.PHYSICS_ENTITY,
        xVelocity: 0,
        yVelocity: 0,
        angularVelocity: 0,
        angle: 0,
        lastUpdate: 0
    };

    var update = function update(core) {
        var needsUpdate = this._super.update(core);

        if (this._super.x != this.body.position.x) {
            needsUpdate |= true;
            this._super.x = this.body.position.x;
        }

        if (this._super.y != this.body.position.y) {
            needsUpdate |= true;
            this._super.y = this.body.position.y;
        }

        if (this.data.xVelocity != this.body.velocity.x) {
            needsUpdate |= true;
            this.data.xVelocity = this.body.velocity.x;
        }

        if (this.data.yVelocity != this.body.velocity.y) {
            needsUpdate |= true;
            this.data.yVelocity = this.body.velocity.y;
        }

        if (this.data.angle != this.body.angle) {
            needsUpdate |= true;
            this.data.angle = this.body.angle;
        }

        if (this.data.angularVelocity != this.body.angularVelocity) {
            needsUpdate |= true;
            this.data.angularVelocity = this.body.angularVelocity;
        }

        if (needsUpdate == true) {
            this.data.lastUpdate = Date.now();
        }

        return needsUpdate;
    };

    var onCollision = function onCollision(entity, pair, body) {};

    var isType = function isType(type) {
        return type === this.data.type || this._super.isType(type);
    };

    var toData = function toData() {
        return Object.extend({}, this._super.toData(), Object.mask(SCHEMA, this.data, true));
    };

    var dataUpdate = function dataUpdate(data) {
        this._super.dataUpdate(data);
        this.data = Object.mask(this.data, data);

        var delay = 0;
        var xVelCorr = 0;
        var yVelCorr = 0;
        var angleVelCorr = 0;
        if (this.lastBodyUpdate !== null) {
            delay = Core.getTime() - this.data.lastUpdate;
            var delta = Date.now() + delay - this.lastBodyUpdate;

            xVelCorr = (this._super.x - this.body.position.x) / (delta / (1000 / 60));
            yVelCorr = (this._super.y - this.body.position.y) / (delta / (1000 / 60));
            angleVelCorr = (this.data.angle - this.body.angle) / (delta / (1000 / 60));
        }

        this.lastBodyUpdate = Date.now() + delay;
        //console.log(`${this.body.velocity.x} ${this.data.xVelocity} ${this.body.position.x} ${this._super.x} ${xVelCorr}`);

        Matter.Body.setVelocity(this.body, { x: this.data.xVelocity + xVelCorr, y: this.data.yVelocity + yVelCorr });
        Matter.Body.setAngularVelocity(this.body, this.data.angularVelocity + angleVelCorr);
        //Matter.Body.setPosition(this.body, { x: this._super.x, y: this._super.y });
        //Matter.Body.setAngle(this.body, this.data.angle);
    };

    var setBody = function setBody(body) {
        Matter.Body.set(body, {
            position: { x: this._super.x, y: this._super.y },
            angle: this.data.angle
        });
        Matter.Body.setVelocity(body, { x: this.data.xVelocity, y: this.data.yVelocity });
        Matter.Body.setAngularVelocity(body, this.data.angularVelocity);

        this.body = body;
        this.body.entityId = this._super.id;
        Matter.World.add(Core.engine.world, this.body);
    };

    var onDelete = function onDelete() {
        Matter.Composite.remove(Core.engine.world, this.body);
    };

    var PhysicsEntity = function PhysicsEntity(data) {
        this._super = new Entity(data);

        this.data = Object.mask(SCHEMA, Object.extend({}, {
            lastUpdate: Date.now()
        }, data));

        this.body = null;
        this.lastBodyUpdate = Date.now();

        var scope = this;
        return Object.extend({}, this._super, Object.bind({
            toData: toData,
            update: update,
            isType: isType,
            dataUpdate: dataUpdate,
            onDelete: onDelete,
            setBody: setBody,
            onCollision: onCollision
        }, this), {
            get type() {
                return scope.data.type;
            },
            get body() {
                return scope.body;
            }
        });
    };

    return PhysicsEntity;
}();

var Mob = new function () {
    var SCHEMA = {
        _protect: ['type'],
        type: ENTITIES.MOB,
        health: 10
    };

    var update = function update(core) {
        var needsUpdate = this._super.update(core);

        return needsUpdate;
    };

    var isType = function isType(type) {
        return type === this.data.type || this._super.isType(type);
    };

    var toData = function toData() {
        return Object.extend({}, this._super.toData(), Object.mask(SCHEMA, this.data, true));
    };

    var dataUpdate = function dataUpdate(data) {
        this._super.dataUpdate(data);
        this.data = Object.mask(this.data, data);
    };

    var Mob = function Mob(data) {
        this._super = new PhysicsEntity(data);

        this.data = Object.mask(SCHEMA, data);

        var scope = this;
        return Object.extend({}, this._super, Object.bind({
            toData: toData,
            update: update,
            isType: isType,
            dataUpdate: dataUpdate
        }, this), {
            get type() {
                return scope.data.type;
            }
        });
    };

    return Mob;
}();

// Associates entity classes with their type
var EntityFactory = {
    store: {},

    registerEntity: function registerEntity(main, type) {
        if (type !== null && type !== undefined) {
            this.store[type] = main;
        }
    },

    getEntityClass: function getEntityClass(type) {
        if (this.store.hasOwnProperty(type)) {
            return this.store[type];
        } else {
            throw new Error("Entity type " + type + " not registered.");
        }
    },

    initFromData: function initFromData(data) {
        if (data.hasOwnProperty('type') === false) {
            console.log("Data missing type");
            console.log(data);
            return null;
        }

        return new (this.getEntityClass(data.type))(data);
    }
};

//EntityFactory.registerEntity(Mob, ENTITIES.MOB);

exports.EntityFactory = EntityFactory;