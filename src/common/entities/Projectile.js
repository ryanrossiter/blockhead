import Helpers from '../helpers';
import PhysicsEntity from './PhysicsEntity';
import Mob from './Mob';
import COMMON from '../common';
let { ENTITIES } = COMMON;

import Matter from 'matter-js';
import Physics from '../physics';

const _data = Symbol('data');
const SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.PROJECTILE
};

const DEFAULT_LIFETIME = 2500;

export default class Projectile extends PhysicsEntity {
    get type() { return this[_data].type }

    constructor(data) {
        super(Object.assign({}, data, {
            w: data.w || 1,
            h: data.h || 1,
        }));

        this[_data] = Helpers.mask(SCHEMA, data);

        this.body.frictionAir = 0;
        this.body.restitution = 0;
        this.body.mass = 0.3;

        this.lifetime = DEFAULT_LIFETIME;
    };

    onCollision(entity, pair) {
        if (entity && entity.player === this.player) {
            Matter.Pair.setActive(pair, false);
        } else {
            if (Physics.isClient === false) {
                if (entity && entity instanceof Mob) {
                    entity.health = entity.health - 1;
                }
            }
            this.deleted = true;
        }
    }

    update(core) {
        let needsUpdate = super.update(core);

        this.lifetime -= core.getUpdateDelta();
        if (this.lifetime <= 0) {
            this.deleted = true;
        }

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

