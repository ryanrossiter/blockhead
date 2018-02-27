import Core from '../core';
import Grenade from '../common/entities/Grenade';
import ClientExplosion from './ClientExplosion';

import COMMON from '../common/common';
let { ITEMS } = COMMON;

import ItemModels from '../models/ItemModels';

export default class ClientGrenade extends Grenade {
    constructor(data) {
        super(data);

        this.cube = new THREE.Mesh( ItemModels[ITEMS.GRENADE].geom, ItemModels[ITEMS.GRENADE].mat );
        this.cube.position.x = this.x;
        this.cube.position.y = this.y;
        this.cube.rotation.x = this.cube.rotation.y = this.cube.rotation.z = this.hashCode;

        Core.scene.add( this.cube );

        this.startTime = Date.now();
    }

    clientUpdate() {
    }
    
    geometryUpdate() {
        this.cube.visible = !this.deleted;
        this.cube.position.x = this.body.position.x;
        this.cube.position.y = this.body.position.y;
        this.cube.rotation.z += Math.min(0.02, this.body.speed / 5);
        this.cube.rotation.x += Math.min(0.02, this.body.speed / 5);
        this.cube.rotation.y += Math.min(0.02, this.body.speed / 5);
        this.cube.position.z = Math.min(Math.abs(Math.cos((Date.now() - this.startTime) / 100 - 0.2)) * 5 * this.body.speed, 5) + 0.4;
    }

    explode() {
        let explosion = new ClientExplosion({
            x: this.x,
            y: this.y,
            explosionRadius: 14,
        });
        Core.entities[explosion.id] = explosion;
    }

    onDelete() {
        this.explode();
        super.onDelete();
        Core.scene.remove(this.cube);
    }
}