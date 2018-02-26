import Core from '../core';
import Zombie from '../common/entities/Zombie';

import * as THREE from 'three';

// basic monochromatic energy preservation
const alpha = 0.3;
const beta = 2.8;
const gamma = 0.18;
const diffuseColor = new THREE.Color().setHSL( alpha, 0.5, gamma * 0.5 + 0.1 ).multiplyScalar( 1 - beta * 0.2 );
const armGeom = new THREE.BoxGeometry( 3, 1, 1 );

const DAMAGE_FLASH_DURATION = 100;

export default class ClientZombie extends Zombie {
    constructor(data) {
        super(data);

        this.material = new THREE.MeshToonMaterial( {
            //map: imgTexture,
            //bumpMap: imgTexture,
            //bumpScale: bumpScale,
            color: diffuseColor,
            specular: 0.2,
            reflectivity: 0.2,
            shininess: 0.2,
            envMap: null
        } );

        var geometry = new THREE.BoxGeometry( this.w, this.h, 5 );
        //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        let cube = new THREE.Mesh( geometry, this.material );
        cube.position.z = 2.5;

        
        let armA = new THREE.Mesh( armGeom, this.material );
        armA.position.z = 3;
        armA.position.x = 2;
        armA.position.y = 1.4;

        let armB = new THREE.Mesh( armGeom, this.material );
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

        this.damageFlashStart = 0;
    }

    get damageFlashDuration() { return Date.now() - this.damageFlashStart; }

    clientUpdate() {
    }

    dataUpdate(data, now) {
        if (data.health < this.health) {
            this.damageFlashStart = Date.now();
        }

        super.dataUpdate(data, now);
    }

    geometryUpdate() {
        this.group.position.x = this.body.position.x;
        this.group.position.y = this.body.position.y;
        this.group.rotation.z = this.angleFacing;
        let waddle = Math.sin(Date.now() / 80 + this.hashCode) * this.body.speed;
        this.group.rotation.x = Math.cos(this.angleFacing) * waddle;
        this.group.rotation.y = Math.sin(this.angleFacing) * waddle;
        
        if (this.damageFlashDuration < DAMAGE_FLASH_DURATION) {
            let color = diffuseColor.clone();
            let flash = Math.cos((this.damageFlashDuration / DAMAGE_FLASH_DURATION) * Math.PI / 2 - 0.1);
            color.add({r: flash * 0.08, g: -flash * 0.1, b: -flash * 0.05});
            this.material.color = color;
        } else {
            this.material.color = diffuseColor;
        }
    }

    onDelete() {
        super.onDelete();
        Core.scene.remove(this.group);
    }
}