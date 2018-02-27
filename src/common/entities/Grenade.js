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
    type: ENTITIES.GRENADE
};

const EXPLOSION_RADIUS = 14;
const DEFAULT_LIFETIME = 2500;

export default class Grenade extends PhysicsEntity {
    get type() { return this[_data].type }

    constructor(data) {
        super(Object.assign({}, data, {
            w: data.w || 1,
            h: data.h || 1,
        }));

        this[_data] = Helpers.mask(SCHEMA, data);

        this.body.frictionAir = 0.1;
        this.body.restitution = 1;
        this.body.mass = 0.4;

        this.lifetime = DEFAULT_LIFETIME;
    };

    update(core) {
        let needsUpdate = super.update(core);

        this.lifetime -= core.getUpdateDelta();
        if (this.lifetime <= 0) {// damage entities in radius
            let es = core.entity.getInRect(this.x - EXPLOSION_RADIUS, this.y - EXPLOSION_RADIUS, this.x + EXPLOSION_RADIUS, this.y + EXPLOSION_RADIUS);
            for (var i = 0; i < es.length; i++) {
                if (es[i] instanceof Mob && es[i].distanceFrom(this.x, this.y) <= EXPLOSION_RADIUS) {
                    es[i].health = es[i].health - 3;
                }
            }

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

