import Helpers from '../helpers';
import Mob from './Mob';
import Player from './Player';
import COMMON from '../common';
let { ENTITIES } = COMMON;

import Matter from 'matter-js';
import Physics from '../physics';

const _data = Symbol('data');
const SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.ZOMBIE,
};

const ACCELERATION = 0.03;
const TARGET_DELAY = 500;
const ATTACK_DELAY = 1000;

export default class Zombie extends Mob {
    get type() { return this[_data].type }

    constructor(data) {
        super(Object.assign({}, data, {
            health: data.health || 5,
        }));

        this[_data] = Helpers.mask(SCHEMA, data);
        this.targetEntity = null;
        this.targetTimer = 0;

        this.collidingEntity = null;
        this.attackTimer = 0;
    };

    onCollision(entity, pair) {
        if (Physics.isClient === false) {
            if (entity && entity instanceof Player) {
                this.collidingEntity = entity;
            }
        }
    }

    onCollisionEnd(entity, pair) {
        if (Physics.isClient === false && this.collidingEntity && entity && this.collidingEntity.id === entity.id) {
            this.collidingEntity = null;
        }
    }

    update(core) {
        let needsUpdate = super.update(core);

        if (this.targetEntity) {
            let dX = this.targetEntity.x - this.x;
            let dY = this.targetEntity.y - this.y;
            let dAF = (Math.atan(dY / dX) + (dX < 0? Math.PI : 0) + 2 * Math.PI) % (2 * Math.PI) - this.angleFacing;
            if (Math.abs(dAF) > Math.PI) dAF = dAF - Math.sign(dAF) * 2 * Math.PI;
            this.angleFacing = (this.angleFacing + Math.sign(dAF) * Math.min(Math.abs(dAF), 0.1) + 2 * Math.PI) % (2 * Math.PI);

            let v = Matter.Vector.normalise({ x: dX, y: dY });
            Matter.Body.setVelocity(this.body, {
                x: this.body.velocity.x + v.x * ACCELERATION,
                y: this.body.velocity.y + v.y * ACCELERATION,
            });
        }

        if (this.targetTimer <= 0) {
            let cd = -1;
            let closest = null;
            for (const playerId in core.playerNames) {
                let ent = core.entities[playerId];
                if (ent instanceof Player === false) continue;
                let d = ent.distanceFrom(this.x, this.y)
                if (d < cd || cd === -1) {
                    closest = ent;
                    cd = d;
                }
            }
            if (closest) this.targetEntity = closest;
        } else this.targetTimer -= core.getUpdateDelta();

        if (this.attackTimer <= 0) {
            if (this.collidingEntity) {
                this.collidingEntity.health = this.collidingEntity.health - 1;
                this.attackTimer = ATTACK_DELAY;
            }
        } else this.attackTimer -= core.getUpdateDelta();

        return needsUpdate;
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

