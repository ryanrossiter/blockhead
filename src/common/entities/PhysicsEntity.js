import Helpers from '../helpers';
import Entity from './Entity';
import COMMON from '../common';
import Matter from 'matter-js';
import Physics from '../physics';
let { ENTITIES } = COMMON;

const _data = Symbol('data');
const SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.PHYSICS_ENTITY,
    xVelocity: 0,
    yVelocity: 0,
    angularVelocity: 0,
    angle: 0,
    lastUpdate: 0,
};

export default class PhysicsEntity extends Entity {
    get type() { return this[_data].type }
    get angle() { return this[_data].angle }

    constructor(data) {
        super(data);

        this[_data] = Helpers.mask(SCHEMA, Object.assign({}, {
            lastUpdate: Date.now(),
        }, data));

        this.setBody(this.createBody());
    };

    createBody() {
        let body = new Matter.Bodies.circle(this.x, this.y, this.w / 2);
        body.friction = 0.0;
        body.frictionAir = 0.2;
        return body;
    }

    update(core) {
        var needsUpdate = super.update(core);

        if (super.x != this.body.position.x) {
            needsUpdate |= true;
            super.x = this.body.position.x;
        }

        if (super.y != this.body.position.y) {
            needsUpdate |= true;
            super.y = this.body.position.y;
        }

        if (this[_data].xVelocity != this.body.velocity.x) {
            needsUpdate |= true;
            this[_data].xVelocity = this.body.velocity.x;
        }

        if (this[_data].yVelocity != this.body.velocity.y) {
            needsUpdate |= true;
            this[_data].yVelocity = this.body.velocity.y;
        }

        if (this[_data].angle != this.body.angle) {
            needsUpdate |= true;
            this[_data].angle = this.body.angle;
        }

        if (this[_data].angularVelocity != this.body.angularVelocity) {
            needsUpdate |= true;
            this[_data].angularVelocity = this.body.angularVelocity;
        }

        if (needsUpdate == true) {
            this[_data].lastUpdate = Date.now();
        }

        return needsUpdate;
    }

    onCollision(entity, pair, body) {

    }

    toData() {
        return Object.assign({},
            super.toData(),
            Helpers.mask(SCHEMA, this[_data], true)
        );
    }

    dataUpdate(data, now) {
        super.dataUpdate(data);
        this[_data] = Helpers.mask(this[_data], data);

        var delay = 0;
        var xVelCorr = 0;
        var yVelCorr = 0;
        var angleVelCorr = 0;
        if (this.lastBodyUpdate !== null) {
            delay = now - this[_data].lastUpdate;
            var delta = Date.now() + delay - this.lastBodyUpdate;

            xVelCorr = (super.x - this.body.position.x) / (delta / (1000 / 60));
            yVelCorr = (super.y - this.body.position.y) / (delta / (1000 / 60));
            angleVelCorr = (this[_data].angle - this.body.angle) / (delta / (1000 / 60));
        }

        this.lastBodyUpdate = Date.now() + delay;
        //console.log(`${this.body.velocity.x} ${this[_data].xVelocity} ${this.body.position.x} ${super.x} ${xVelCorr}`);
        //console.log("aa", xVelCorr);
        Matter.Body.setVelocity(this.body, { x: this[_data].xVelocity + xVelCorr, y: this[_data].yVelocity + yVelCorr });
        Matter.Body.setAngularVelocity(this.body, this[_data].angularVelocity + angleVelCorr);
        //Matter.Body.setPosition(this.body, { x: super.x, y: super.y });
        //Matter.Body.setAngle(this.body, this[_data].angle);
    }

    setBody(body) {
        Matter.Body.set(body, {
            position: { x: this.x, y: this.y },
            angle: this[_data].angle,
        });
        Matter.Body.setVelocity(body, { x: this[_data].xVelocity, y: this[_data].yVelocity });
        Matter.Body.setAngularVelocity(body, this[_data].angularVelocity);

        this.body = body;
        this.body.entityId = this.id;
        this.lastBodyUpdate = Date.now();
        Matter.World.add(Physics.engine.world, this.body);
    }

    onDelete() {
        Matter.Composite.remove(Physics.engine.world, this.body);
    }
};