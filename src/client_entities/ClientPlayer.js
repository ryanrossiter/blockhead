import Core from '../core';
import Player from '../common/entities/Player';
import COMMON from '../common/common';
let { KEYS } = COMMON;

import * as THREE from 'three';

// basic monochromatic energy preservation
const alpha = 0.8;
const beta = 3;
const gamma = 0.8;
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

export default class ClientPlayer extends Player {
    get angleFacing() { return super.angleFacing; };
    set angleFacing(angle) { if (this.angleFacing !== angle) { super.angleFacing = angle; Core.socket.emit("move.angleFacing", { angle }); }};

    constructor(data) {
        super(data);

        var geometry = new THREE.BoxGeometry( this.w, this.h, 5 );
        //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        let cube = new THREE.Mesh( geometry, material );
        cube.position.z = 2.5;
        
        geometry = new THREE.BoxGeometry( 2, 1, 1 );
        var mat = new THREE.MeshBasicMaterial( { color: 0x333333 } );
        let ting = new THREE.Mesh( geometry, mat );
        ting.position.z = 3;
        ting.position.x = 3;

        this.group = new THREE.Group();
        this.group.add(cube);
        this.group.add(ting);
        this.group.position.x = this.x;
        this.group.position.y = this.y;

        Core.scene.add( this.group );
    }

    dataUpdate(data, now) {
        // dont update angle facing for current player
        if (data.id === Core.playerId) delete data.angleFacing;

        super.dataUpdate(data, now);
    }

    onDelete() {
        super.onDelete();
        Core.scene.remove(this.group);
    }

    geometryUpdate() {
        if (this.id === Core.playerId) {
            let dx = Core.mousePosition.x - window.innerWidth / 2;
            let dy = Core.mousePosition.y - window.innerHeight / 2;
            this.angleFacing = Math.atan(-dy / dx) + (dx < 0? Math.PI : 0);

            Core.setCameraAt(this.body.position.x, this.body.position.y);
        }

        this.group.position.x = this.body.position.x;
        this.group.position.y = this.body.position.y;
        this.group.rotation.z = this.angleFacing;

        let hop = Math.sin(Date.now() / 35 + this.hashCode) * this.body.speed * 1.5;
        this.group.position.z = hop;
    }

    clientUpdate() {
        if (this.id === Core.playerId) {
            if (Core.mouseButtons[1]) {
                if (super.shoot === false) {
                    Core.socket.emit("move.shoot");
                }
            } else if (super.shoot === true) {
                Core.socket.emit("move.shoot.stop");
            }

            if (Core.keys[KEYS.UP] || Core.keys[KEYS.W]) {
                if (super.forward === false) {
                    Core.socket.emit("move.forward");
                }
            } else if (super.forward === true) {
                Core.socket.emit("move.forward.stop");
            }

            if (Core.keys[KEYS.DOWN] || Core.keys[KEYS.S]) {
                if (super.backward === false) {
                    Core.socket.emit("move.backward");
                }
            } else if (super.backward === true) {
                Core.socket.emit("move.backward.stop");
            }

            if (Core.keys[KEYS.LEFT] || Core.keys[KEYS.A]) {
                if (super.left === false) {
                    Core.socket.emit("move.left");
                }
            } else if (super.left === true) {
                Core.socket.emit("move.left.stop");
            }

            if (Core.keys[KEYS.RIGHT] || Core.keys[KEYS.D]) {
                if (super.right === false) {
                    Core.socket.emit("move.right");
                }
            } else if (super.right === true) {
                Core.socket.emit("move.right.stop");
            }
        }
    }
}