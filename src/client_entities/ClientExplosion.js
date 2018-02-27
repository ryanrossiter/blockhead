import Core from '../core';
import Entity from '../common/entities/Entity';

//import * as THREE from 'three';

const EXPLOSION_RADIUS = 5;
const EXPLOSION_DURATION = 200;
const material = new THREE.MeshToonMaterial( {
    //map: imgTexture,
    //bumpMap: imgTexture,
    //bumpScale: bumpScale,
    color: 0xBB1A11,
    specular: 0.2,
    reflectivity: 0.2,
    shininess: 0.2,
    envMap: null
} );

export default class ClientExplosion extends Entity {
    constructor(data) {
        super(data);

        this.geom = new THREE.SphereGeometry( 1 );
        this.group = new THREE.Mesh(this.geom, material);

        this.group.position.x = this.x;
        this.group.position.y = this.y;
        this.group.position.z = 1.5;

        Core.scene.add( this.group );

        this.explosionStart = Date.now();
        this.explosionRadius = data.explosionRadius || EXPLOSION_RADIUS;
    }

    get explosionDuration() { return Date.now() - this.explosionStart; }

    clientUpdate() {
        if (this.explosionDuration > EXPLOSION_DURATION) {
            this.onDelete();
            delete Core.entities[this.id];
        }
    }

    geometryUpdate() {
        let scale = this.explosionDuration / EXPLOSION_DURATION * this.explosionRadius;
        this.group.scale.x = this.group.scale.y = scale;
        this.group.scale.z = Math.max(scale * 0.6, 1); /// make it shorter
    }

    onDelete() {
        super.onDelete();
        Core.scene.remove(this.group);
    }
}