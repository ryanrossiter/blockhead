import Helpers from '../helpers';
import Mob from './Mob';
import COMMON from '../common';
let { ENTITIES } = COMMON;

import Matter from 'matter-js';

const _data = Symbol('data');
const SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.ZOMBIE,
};

const ACCELERATION = 0.03;
const TARGET_DELAY = 500;

export default class Zombie extends Mob {
    get type() { return this[_data].type }

    constructor(data) {
        super(data);

        this[_data] = Helpers.mask(SCHEMA, data);
        this.targetEntity = null;
        this.targetTimer = 0;
    };

    onCollision(entity, pair) {
        // if (entity && entity) {
        //     Matter.Pair.setActive(pair, false);
        // } else {
        //     this.deleted = true;
        // }
    }

    update(core) {
        let needsUpdate = super.update(core);

        if (this.targetEntity) {
            let dX = this.targetEntity.x - this.x;
            let dY = this.targetEntity.y - this.y;
            this.angleFacing = Math.atan(dY / dX) + (dX < 0? Math.PI : 0);

            let v = Matter.Vector.normalise({ x: dX, y: dY });
            Matter.Body.setVelocity(this.body, {
                x: this.body.velocity.x + v.x * ACCELERATION,
                y: this.body.velocity.y + v.y * ACCELERATION,
            });
        }

        if (this.targetTimer <= 0) {
            let playerId = Object.keys(core.playerNames)[0];
            if (playerId) this.targetEntity = core.entities[playerId];
        } else this.targetTimer -= core.getUpdateDelta();

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

