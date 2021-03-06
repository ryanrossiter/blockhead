import Helpers from '../helpers';
import COMMON from '../common';
let { ENTITIES } = COMMON;

const _data = Symbol('data');
const SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.ENTITY,
    id: undefined,
    player: null,
    x: 0,
    y: 0,
    w: 3,
    h: 3,
};

export default class Entity {
    constructor(data) {
        this[_data] = Helpers.mask(SCHEMA, Object.assign({}, data, {
            id: data.id || Helpers.createId(),
        }));
        // protect the id once it's set, not really necessary but a neat feature
        this[_data]._protect.push('id');

        this.hashCode = Helpers.hashCode(this.id);
        this.needsUpdate = true; // Start with updating the clients
        this.serverSideOnly = false;
        this.deleted = false;

        if (this[_data].w === -1 || this[_data].h === -1) {
            this[_data].w = this[_data].h = this[_data].r * 2;
        }
    };

    distanceFrom(x, y) {
        return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
    }

    setPos(newX, newY) {
        this[_data].x = newX;
        this[_data].y = newY;
    };

    move(dx, dy) {
        setPos.call(this, this[_data].x + dx, this[_data].y + dy);
    };

    inRect(x0, y0, x1, y1) {
        return !(this.x < x0 || this.y < y0 || this.x > x1 || this.y > y1);
    }

    update(core) { return this.needsUpdate; }; // returns true if we need to send an update to the client.

    clientUpdate() {};

    // full used in cases where changes are usually sent in segments but the full data needs to be sent (first update)
    toData(full) {
        return Helpers.mask(SCHEMA, this[_data], true);
    };

    dataUpdate(data, now) {
        this[_data] = Helpers.mask(this[_data], data);
    };

    onDelete() {

    };

    get id() { return this[_data].id }
    get type() { return this[_data].type }
    get player() { return this[_data].player }
    set player(p) { this.needsUpdate = true; this[_data].player = p}
    get x() { return this[_data].x }
    get y() { return this[_data].y }
    set x(x) { this.needsUpdate = true; this[_data].x = x }
    set y(y) { this.needsUpdate = true; this[_data].y = y }
    get w() { return this[_data].w }
    get h() { return this[_data].h }
    set w(w) { this.needsUpdate = true; this[_data].w = w }
    set h(h) { this.needsUpdate = true; this[_data].h = h }
};