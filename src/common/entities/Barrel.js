import Helpers from '../helpers';
import Mob from './Mob';
import COMMON from '../common';
let { ENTITIES } = COMMON;

import Matter from 'matter-js';

const _data = Symbol('data');
const SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.BARREL,
};

const EXPLOSION_RADIUS = 18;

export default class Barrel extends Mob {
    get type() { return this[_data].type }

    constructor(data) {
        super(Object.assign({}, data, {
            health: data.health || 3,
        }));

        this[_data] = Helpers.mask(SCHEMA, data);

        Matter.Body.setStatic(this.body, true);
    };

    onDeath(core) {
        // damage entities in radius
        let es = core.entity.getInRect(this.x - EXPLOSION_RADIUS, this.y - EXPLOSION_RADIUS, this.x + EXPLOSION_RADIUS, this.y + EXPLOSION_RADIUS);
        for (var i = 0; i < es.length; i++) {
            if (es[i] instanceof Mob && es[i].distanceFrom(this.x, this.y) <= EXPLOSION_RADIUS) {
                es[i].health = es[i].health - 3;
            }
        }
    }

    update(core) {
        let needsUpdate = super.update(core);

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

