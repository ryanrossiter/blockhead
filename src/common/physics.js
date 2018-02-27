import Matter from 'matter-js';

export default {
    engine: null,
    isClient: false,

    onCollision: function(pair, bodyA, bodyB, start) {
        if (bodyA.hasOwnProperty('entityId') || bodyB.hasOwnProperty('entityId')) {
            var entityA = bodyA.entityId? this.entities[bodyA.entityId] : null;
            var entityB = bodyB.entityId? this.entities[bodyB.entityId] : null;

            if (entityA) {
                if (start) entityA.onCollision(entityB, pair, pair.bodyA);
                else entityA.onCollisionEnd(entityB, pair, pair.bodyA);
            }

            if (entityB) {
                if (start) entityB.onCollision(entityA, pair, pair.bodyA);
                else entityB.onCollisionEnd(entityA, pair, pair.bodyA);
            }
        }
    },

    collisionIterator(start) {
        return (event) => {
            for (var i = 0; i < event.pairs.length; i++) {
                var bodyA = event.pairs[i].bodyA;
                var bodyB = event.pairs[i].bodyB;
                // Find parent body, will contain the entityId
                while (bodyA.parent != bodyA) bodyA = bodyA.parent;
                while (bodyB.parent != bodyB) bodyB = bodyB.parent;
                
                this.onCollision(event.pairs[i], bodyA, bodyB, start);
            }
        }
    },
    
    CreateEngine: function(core) {

        this.engine = Matter.Engine.create();
        this.engine.world.gravity.y = 0;

        this.isClient = core.isClient;

        this.onCollision = this.onCollision.bind(core);
        Matter.Events.on(this.engine, "collisionStart", this.collisionIterator(true));
        Matter.Events.on(this.engine, "collisionEnd", this.collisionIterator(false));
    },
}