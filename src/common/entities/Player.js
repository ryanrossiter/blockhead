import Helpers from '../helpers';
import Mob from './Mob';
import Projectile from './Projectile';
import Grenade from './Grenade';
import FloatingItem from './FloatingItem';
import COMMON from '../common';
import Matter from 'matter-js';
let { ENTITIES, ITEMS } = COMMON;

const ACCELERATION = 0.1;
const GUN_DATA = {};
GUN_DATA[ITEMS.HANDGUN] = { delay: 600 };
GUN_DATA[ITEMS.RIFLE] = { delay: 200 };
GUN_DATA[ITEMS.GRENADE] = { delay: 1000 };
const PROJECTILE_SPEED = 3.5;
const INTERACT_RADIUS = 8;
const INVENTORY_SIZE = 4;
const MAX_HEALTH = 10;

const _data = Symbol('data');
const SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.PLAYER,
    forward: false,
    backward: false,
    left: false,
    right: false,
    shoot: false,
    inventory: undefined,
    selected: 0, // selected inventory item
};

export default class Player extends Mob {
    get type() { return this[_data].type }
    get shoot() { return this[_data].shoot; }
    set shoot(s) { if (this[_data].shoot !== s) { this.needsUpdate = true; this[_data].shoot = s; }}
    get forward() { return this[_data].forward; }
    set forward(f) { if (this[_data].forward !== f) { this.needsUpdate = true; this[_data].forward = f; this._forward(); }}
    get backward() { return this[_data].backward; }
    set backward(b) { if (this[_data].backward !== b) { this.needsUpdate = true; this[_data].backward = b; this._backward(); }}
    get left() { return this[_data].left; }
    set left(l) { if (this[_data].left !== l) { this.needsUpdate = true; this[_data].left = l; this._left(); }}
    get right() { return this[_data].right; }
    set right(r) { if (this[_data].right !== r) { this.needsUpdate = true; this[_data].right = r; this._right(); }}
    get inventory() { return this[_data].inventory; }
    get selected() { return this[_data].selected; }
    set selected(s) { if (s >= 0 && s < INVENTORY_SIZE) { this.needsUpdate = true; this[_data].selected = s; }}

    constructor(data) {
        super(Object.assign({}, {
            health: data.health || MAX_HEALTH
        }, data));

        this[_data] = Helpers.mask(SCHEMA, Object.assign({}, {
            inventory: data.inventory || Array.apply(null, Array(INVENTORY_SIZE)).map(() => null)
        }, data));

        this.shootTimer = 0;
    };

    addToInventory(item) {
        let nullInd = -1;
        for (var i = 0; i < INVENTORY_SIZE; i++) {
            if (this.inventory[i] === null) {
                if (nullInd === -1) nullInd = i;
            } else if (this.inventory[i].type === item.type) {
                this.inventory[i].ammo += item.ammo;
                this.needsUpdate = true;
                return true;
            }
        }

        if (nullInd !== -1) {
            this.inventory[nullInd] = item;
            this.needsUpdate = true;
            return true;
        }

        return false;
    }

    interact(core) {
        // interact with closest entity in INTERACT_RADIUS
        let es = core.entity.getInRect(this.x - INTERACT_RADIUS, this.y - INTERACT_RADIUS, this.x + INTERACT_RADIUS, this.y + INTERACT_RADIUS);
        let e = null;
        let closest = INTERACT_RADIUS;
        for (var i = 0; i < es.length; i++) {
            let d = es[i].distanceFrom(this.x, this.y);
            if (es[i] instanceof FloatingItem && d <= INTERACT_RADIUS) {
                closest = d;
                e = es[i];
            }
        }

        if (e) {
            if (e.item.type === ITEMS.HEALTH) {
                if (this.health < MAX_HEALTH) {
                    e.deleted = true;
                    this.health = Math.min(this.health + (e.item.health || 1), MAX_HEALTH);
                }
            } else if (this.addToInventory(e.item)) {
                e.deleted = true;
            }
        }
    }

    update(core) {
        let needsUpdate = super.update(core);

        if (this.shootTimer > 0) this.shootTimer -= core.getUpdateDelta();

        if (this[_data].shoot === true && this.inventory[this.selected] !== null
            && this.inventory[this.selected].ammo > 0 && this.shootTimer <= 0) {
            this._shoot(core);
            this.shootTimer = GUN_DATA[this.inventory[this.selected].type].delay;
            this.inventory[this.selected].ammo--;
            this.needsUpdate = true;
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

    _shoot(core) {
        let xv = Math.cos(this.angleFacing);
        let yv = Math.sin(this.angleFacing);
        core.entity.create(this.inventory[this.selected].type === ITEMS.GRENADE? Grenade : Projectile, {
            player: this.player,
            x: this.x + yv + xv, // add these to make bullet come out of gun, 1 unit to the right side and 1 unit forward
            y: this.y - xv + yv,
            xVelocity: xv * PROJECTILE_SPEED,
            yVelocity: yv * PROJECTILE_SPEED,
            angle: this.angleFacing
        });
    }

    _left() {
        Matter.Body.setVelocity(this.body, {
            x: this.body.velocity.x - ACCELERATION,
            y: this.body.velocity.y,
        });
    }

    _right() {
        Matter.Body.setVelocity(this.body, {
            x: this.body.velocity.x + ACCELERATION,
            y: this.body.velocity.y,
        });
    }

    _forward() {
        Matter.Body.setVelocity(this.body, {
            x: this.body.velocity.x,
            y: this.body.velocity.y + ACCELERATION,
        });
    }

    _backward() {
        Matter.Body.setVelocity(this.body, {
            x: this.body.velocity.x,
            y: this.body.velocity.y - ACCELERATION,
        });
    }
    
    toData() {
        return Object.assign({},
            super.toData(),
            Helpers.mask(SCHEMA, this[_data], true)
        );
    }

    dataUpdate(data, now) {
        super.dataUpdate(data, now);
        this[_data] = Helpers.mask(this[_data], data);
    }
};

