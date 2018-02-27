import Helpers from './helpers';
import COMMON from '../common';
import Barrel from '../entities/Barrel';
import ZombieSpawner from '../entities/ZombieSpawner';
import FloatingItem from '../entities/FloatingItem';
let { ITEMS } = COMMON;

const Test1 = {
    objQueue: [],
    entityQueue: [],
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

Test1.entityQueue.push({ entity: Barrel, data: { x: 20, y: 20 } });
Test1.entityQueue.push({ entity: Barrel, data: { x: 20, y: -20 } });
Test1.entityQueue.push({ entity: Barrel, data: { x: -20, y: 20 } });
Test1.entityQueue.push({ entity: Barrel, data: { x: -20, y: -20 } });

Test1.entityQueue.push({ entity: ZombieSpawner, data: { x: 0, y: 35 } });
Test1.entityQueue.push({ entity: ZombieSpawner, data: { x: 0, y: -35 } });
Test1.entityQueue.push({ entity: ZombieSpawner, data: { x: 35, y: 0 } });
Test1.entityQueue.push({ entity: ZombieSpawner, data: { x: -35, y: 0 } });

Test1.entityQueue.push({ entity: FloatingItem, data: { x: 5, y: 5, item: ITEMS.TEST } });

export default Test1;