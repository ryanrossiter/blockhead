import Matter from 'matter-js';

export default {
    Build: (world, map) => {
        for (var i = 0; i < map.objQueue.length; i++) {
            let body = null;
            let { name, x, y, w, h } = map.objQueue[i];
            if (name === "rectangle") {
                body = new Matter.Bodies.rectangle(x, y, w, h);
            }

            if (body) {
                Matter.Body.setStatic(body, true);
                Matter.World.add(world, body);
            }
        }
    }
}