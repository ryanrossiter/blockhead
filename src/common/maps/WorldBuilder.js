import Matter from 'matter-js';

export default {
    Build: (world, map) => {
        for (var i = 0; i < map.objQueue.length; i++) {
            let body = null;
            let { name, x, y, w, h } = map.objQueue[i];
            if (name === "wall") {
                body = new Matter.Bodies.rectangle(x, y, w, h);
            } else if (name === "player-wall") {
                body = new Matter.Bodies.rectangle(x, y, w, h);
                body.collisionFilter.mask = 0xFFFD; // exclude 2nd bit
            }

            if (body) {
                Matter.Body.setStatic(body, true);
                Matter.World.add(world, body);
            }
        }
    }
}