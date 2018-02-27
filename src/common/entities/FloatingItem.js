import Helpers from '../helpers';
import Entity from './Entity';
import COMMON from '../common';
let { ENTITIES, ITEMS } = COMMON;

const _data = Symbol('data');
const SCHEMA = {
    _protect: ['type'],
    type: ENTITIES.FLOATING_ITEM,
    item: ITEMS.TEST
};

export default class FloatingItem extends Entity {
    get type() { return this[_data].type }
    get item() { return this[_data].item; }
    set item(item) { if (this[_data].item !== item) { this.needsUpdate = true; this[_data].item = item; } }

    constructor(data) {
        super(data);

        this[_data] = Helpers.mask(SCHEMA, data);
    };


    update(core) {
        let needsUpdate = super.update(core);

        return needsUpdate;
    }

    toData() {
        return Object.assign({},
            super.toData(),
            Helpers.mask(SCHEMA, this[_data], true)
        );
    }

    dataUpdate(data, now) {
        super.dataUpdate(data, now);
        this[_data] = Helpers.mask(this[_data], data);
    }
};

