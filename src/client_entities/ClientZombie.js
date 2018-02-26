import Core from '../core';
import Zombie from '../common/entities/Zombie';

import * as THREE from 'three';

// basic monochromatic energy preservation
const alpha = 0.3;
const beta = 2.8;
const gamma = 0.18;
const diffuseColor = new THREE.Color().setHSL( alpha, 0.5, gamma * 0.5 + 0.1 ).multiplyScalar( 1 - beta * 0.2 );
const material = new THREE.MeshToonMaterial( {
    //map: imgTexture,
    //bumpMap: imgTexture,
    //bumpScale: bumpScale,
    color: diffuseColor,
    specular: 0.2,
    reflectivity: 0.2,
    shininess: 0.2,
    envMap: null
} );

export default class ClientZombie extends Zombie {
    constructor(data) {
        super(data);

        var geometry = new THREE.BoxGeometry( this.w, this.h, 5 );
        //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        let cube = new THREE.Mesh( geometry, material );
        cube.position.z = 2.5;

        geometry = new THREE.BoxGeometry( 3, 1, 1 );
        let armA = new THREE.Mesh( geometry, material );
        armA.position.z = 3;
        armA.position.x = 2;
        armA.position.y = 1.4;

        let armB = new THREE.Mesh( geometry, material );
        armB.position.z = 3;
        armB.position.x = 2;
        armB.position.y = -1.4;

        this.group = new THREE.Group();
        this.group.add(cube);
        this.group.add(armA);
        this.group.add(armB);
        this.group.position.x = this.x;
        this.group.position.y = this.y;

        Core.scene.add( this.group );
    }

    clientUpdate() {
    }

    geometryUpdate() {
        this.group.position.x = this.body.position.x;
        this.group.position.y = this.body.position.y;
        this.group.rotation.z = this.angleFacing;
        let waddle = Math.sin(Date.now() / 80 + this.hashCode) * this.body.speed;
        this.group.rotation.x = Math.cos(this.angleFacing) * waddle;
        this.group.rotation.y = Math.sin(this.angleFacing) * waddle;
    }

    onDelete() {
        super.onDelete();
        Core.scene.remove(this.group);
    }
}