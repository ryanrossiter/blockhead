import Helpers from '../helpers';
import Entity from './Entity';
import Zombie from './Zombie';
import COMMON from '../common';
let { ENTITIES } = COMMON;

const SPAWN_DELAY = 5000;

export default class ZombieSpawner extends Entity {
    constructor(data) {
        super(data);

        this.serverSideOnly = true;
        this.spawnTimer = 0;
    };

    get spawnTimeElapsed() { return Date.now() - this.spawnTimer; }

    update(core) {
        let needsUpdate = super.update(core);

        if (this.spawnTimeElapsed > SPAWN_DELAY) {
            core.entity.create(Zombie, {
                x: this.x,
                y: this.y,
            });

            this.spawnTimer = Date.now();
        }

        return needsUpdate;
    }
};

