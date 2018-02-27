import Core from '../core';
import Projectile from '../common/entities/Projectile';

import * as THREE from 'three';

// basic monochromatic energy preservation
// const alpha = 0.8;
// const beta = 3;
// const gamma = 0.8;
// const diffuseColor = new THREE.Color().setHSL( alpha, 0.5, gamma * 0.5 + 0.1 ).multiplyScalar( 1 - beta * 0.2 );
// const material = new THREE.MeshToonMaterial( {
//     //map: imgTexture,
//     //bumpMap: imgTexture,
//     //bumpScale: bumpScale,
//     color: diffuseColor,
//     specular: 0.2,
//     reflectivity: 0.2,
//     shininess: 0.2,
//     envMap: null
// } );

const material = new THREE.MeshBasicMaterial( { color: 0x222222 } );

export default class ClientProjectile extends Projectile {
    constructor(data) {
        super(data);

        var geometry = new THREE.BoxGeometry( 1, 0.5, 0.5 );
        //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometry, material );
        this.cube.position.z = 2.5;
        this.cube.position.x = this.x;
        this.cube.position.y = this.y;

        Core.scene.add( this.cube );
    }

    clientUpdate() {
    }
    
    geometryUpdate() {
        this.cube.visible = !this.deleted;
        this.cube.position.x = this.body.position.x;
        this.cube.position.y = this.body.position.y;
        this.cube.rotation.z = this.angle;
    }

    onDelete() {
        super.onDelete();
        Core.scene.remove(this.cube);
    }
}