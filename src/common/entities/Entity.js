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
        this[_data] = Helpers.mask(SCHEMA, data);
        // protect the id once it's set, not really necessary but a neat feature
        this[_data]._protect.push('id');

        this.hashCode = Helpers.hashCode(this.id);
        this.needsUpdate = true; // Start with updating the clients
        this.deleted = false;

        if (this[_data].w === -1 || this[_data].h === -1) {
            this[_data].w = this[_data].h = this[_data].r * 2;
        }
    };

    setPos(newX, newY) {
        this[_data].x = newX;
        this[_data].y = newY;
    };

    move(dx, dy) {
        setPos.call(this, this[_data].x + dx, this[_data].y + dy);
    };

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