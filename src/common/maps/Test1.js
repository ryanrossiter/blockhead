import Helpers from './helpers';
import COMMON from '../common';
import Barrel from '../entities/Barrel';
import ZombieSpawner from '../entities/ZombieSpawner';
import FloatingItem from '../entities/FloatingItem';
let { ITEMS, ENTITIES } = COMMON;

const Test1 = {
    objQueue: [],
    init(core) {
        this.wave = 1;
        this.spawners = [];

        core.entity.create(Barrel, { x: 20, y: 20 } );
        core.entity.create(Barrel, { x: 20, y: -20 } );
        core.entity.create(Barrel, { x: -20, y: 20 } );
        core.entity.create(Barrel, { x: -20, y: -20 } );

        this.spawners.push(core.entity.create(ZombieSpawner, { x: 40, y: 40 } ));
        this.spawners.push(core.entity.create(ZombieSpawner, { x: 40, y: -40 } ));
        this.spawners.push(core.entity.create(ZombieSpawner, { x: -40, y: 40 } ));
        this.spawners.push(core.entity.create(ZombieSpawner, { x: -40, y: -40 } ));

        core.entity.create(FloatingItem, { x: 5, y: 5, item: { type: ITEMS.HANDGUN, ammo: 20 }});
        core.entity.create(FloatingItem, { x: -5, y: 5, item: { type: ITEMS.HANDGUN, ammo: 20 }});
        core.entity.create(FloatingItem, { x: -5, y: -5, item: { type: ITEMS.RIFLE, ammo: 100 }});
        core.entity.create(FloatingItem, { x: 5, y: -5, item: { type: ITEMS.RIFLE, ammo: 100 }});

        core.entity.create(FloatingItem, { x: 30, y: 0, item: { type: ITEMS.HEALTH, health: 2 }});
        core.entity.create(FloatingItem, { x: 0, y: 30, item: { type: ITEMS.HEALTH, health: 2 }});
        core.entity.create(FloatingItem, { x: 0, y: -30, item: { type: ITEMS.HEALTH, health: 2 }});
        core.entity.create(FloatingItem, { x: -30, y: 0, item: { type: ITEMS.HEALTH, health: 2 }});

        core.entity.create(FloatingItem, { x: 15, y: 15, item: { type: ITEMS.GRENADE, ammo: 30 }});

        this.setWave(this.wave);
    },

    setWave(n) {
        for (var i = 0; i < this.spawners.length; i++) {
            this.spawners[i].count = n * 3;
        }
    },

    update(core) {
        let done = true;
        for (var i = 0; i < this.spawners.length; i++) {
            if (this.spawners[i].count > 0) {
                done = false;
                break;
            }
        }

        if (done) { // make sure no zombies are left
            done = core.entity.findByProperty("type", ENTITIES.ZOMBIE).length === 0;
        }

        if (done) {
            this.wave++;
            this.setWave(this.wave);
            core.io.sockets.emit("showMessage", { message: "Wave " + this.wave });
        }
    }
}

// border walls
Helpers.GenerateWall(Test1, 0, 50, 102, 2);
Helpers.GenerateWall(Test1, 50, 0, 2, 102);
Helpers.GenerateWall(Test1, 0, -50, 102, 2);
Helpers.GenerateWall(Test1, -50, 0, 2, 102);

Helpers.GenerateWall(Test1, 0, 10, 10, 2);
Helpers.GenerateWall(Test1, 10, 0, 2, 10);
Helpers.GenerateWall(Test1, 0, -10, 10, 2);
Helpers.GenerateWall(Test1, -10, 0, 2, 10);

Helpers.GenerateWall(Test1, 30, 30, 5, 5);
Helpers.GenerateWall(Test1, 30, -30, 5, 5);
Helpers.GenerateWall(Test1, -30, 30, 5, 5);
Helpers.GenerateWall(Test1, -30, -30, 5, 5);

export default Test1;