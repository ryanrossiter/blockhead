import Helpers from '../helpers';
import Mob from './Mob';
import Projectile from './Projectile';
import COMMON from '../common';
import Matter from 'matter-js';
let { ENTITIES } = COMMON;

const _data = Symbol('data');
const SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.PLAYER,
    forward: false,
    backward: false,
    left: false,
    right: false,
    shoot: false,
};

const ACCELERATION = 0.1;
const SHOOT_DELAY = 100;
const PROJECTILE_SPEED = 2.5;

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

    constructor(data) {
        super(data);

        this[_data] = Helpers.mask(SCHEMA, data);

        this.shootTimer = 0;
    };

    update(core) {
        let needsUpdate = super.update(core);

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

    _shoot(core) {
        core.entity.create(Projectile, {
            player: this.player,
            x: this.x,
            y: this.y,
            xVelocity: Math.cos(this.angleFacing) * PROJECTILE_SPEED,
            yVelocity: Math.sin(this.angleFacing) * PROJECTILE_SPEED,
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

