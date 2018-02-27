import Core from '../core';
import Barrel from '../common/entities/Barrel';
import ClientExplosion from './ClientExplosion';

//import * as THREE from 'three';

const barrelGeom = new THREE.CylinderGeometry( 1.5, 1.5, 3 );
const material = new THREE.MeshToonMaterial( {
    //map: imgTexture,
    //bumpMap: imgTexture,
    //bumpScale: bumpScale,
    color: 0xCC1111,
    specular: 0.2,
    reflectivity: 0.2,
    shininess: 0.2,
    envMap: null
} );

const outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );

export default class ClientBarrel extends Barrel {
    constructor(data) {
        super(data);

        let barrel = new THREE.Mesh(barrelGeom, material);
        let barrelOutline = new THREE.Mesh(barrelGeom, outlineMaterial);
        barrelOutline.scale.multiplyScalar(1.05);
        this.group = new THREE.Group;
        this.group.add(barrel);
        this.group.add(barrelOutline);
        this.group.position.x = this.x;
        this.group.position.y = this.y;
        this.group.position.z = 1.5 + 0.2;
        this.group.rotation.x = Math.PI / 2;

        Core.scene.add( this.group );

        this.exploded = false;
    }

    dataUpdate(data, now) {
        if (data.health <= 0 && !this.exploded) {
            let explosion = new ClientExplosion({
                x: this.x,
                y: this.y,
                explosionRadius: 18
            });
            Core.entities[explosion.id] = explosion;
            this.exploded = true;
        }

        super.dataUpdate(data, now);
    }

    geometryUpdate() {
        this.group.position.x = this.body.position.x;
        this.group.position.y = this.body.position.y;

        // if (false && this.explosionDuration < DAMAGE_FLASH_DURATION) {
        //     let color = diffuseColor.clone();
        //     let flash = Math.cos((this.explosionDuration / DAMAGE_FLASH_DURATION) * Math.PI / 2 - 0.1);
        //     color.add({r: flash * 0.08, g: -flash * 0.1, b: -flash * 0.05});
        //     this.material.color = color;
        // } else {
        //     this.material.color = 0x111111;
        // }
    }

    onDelete() {
        super.onDelete();
        Core.scene.remove(this.group);
    }
}