import Helpers from '../helpers';
import PhysicsEntity from './PhysicsEntity';
import COMMON from '../common';
let { ENTITIES } = COMMON;

const _data = Symbol('data');
const SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.MOB,
    health: 10,
    angleFacing: 0,
};

export default class Mob extends PhysicsEntity {
    get type() { return this[_data].type }
    get angleFacing() { return this[_data].angleFacing; }
    set angleFacing(angle) { if (this[_data].angleFacing !== angle) { this.needsUpdate = true; this[_data].angleFacing = angle; } }
    get health() { return this[_data].health; }
    set health(health) { if (this[_data].health !== health) { this.needsUpdate = true; this[_data].health = health; } }

    constructor(data) {
        super(data);

        this[_data] = Helpers.mask(SCHEMA, data);
    };

    update(core) {
        let needsUpdate = super.update(core);

        if (this.health <= 0) this.deleted = true;

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

