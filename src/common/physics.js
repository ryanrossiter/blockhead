import Matter from 'matter-js';

export default {
    engine: null,
    isClient: false,

    onCollision: function(pair, bodyA, bodyB) {
        if (bodyA.hasOwnProperty('entityId') || bodyB.hasOwnProperty('entityId')) {
            var entityA = bodyA.entityId? this.entities[bodyA.entityId] : null;
            var entityB = bodyB.entityId? this.entities[bodyB.entityId] : null;

            if (entityA) {
                entityA.onCollision(entityB, pair, pair.bodyA);
            }

            if (entityB) {
                entityB.onCollision(entityA, pair, pair.bodyB);
            }
        }
    },
    
    CreateEngine: function(core) {

        this.engine = Matter.Engine.create();
        this.engine.world.gravity.y = 0;

        this.isClient = core.isClient;

        this.onCollision = this.onCollision.bind(core);
        Matter.Events.on(this.engine, "collisionStart", (event) => {
            for (var i = 0; i < event.pairs.length; i++) {
                var bodyA = event.pairs[i].bodyA;
                var bodyB = event.pairs[i].bodyB;
                // Find parent body, will contain the entityId
                while (bodyA.parent != bodyA) bodyA = bodyA.parent;
                while (bodyB.parent != bodyB) bodyB = bodyB.parent;
                
                this.onCollision(event.pairs[i], bodyA, bodyB);
            }
        });
    },
}