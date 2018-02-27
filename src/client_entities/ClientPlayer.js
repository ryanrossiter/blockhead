import Core from '../core';
import Player from '../common/entities/Player';
import COMMON from '../common/common';
let { KEYS } = COMMON;

import * as THREE from 'three';
import GunModels from '../models/GunModels';

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

const outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );

const gunMat = new THREE.MeshBasicMaterial( { color: 0x333333 } );
const gunGeom = new THREE.BoxGeometry( 2, 1, 1 );

let canvas = document.createElement("canvas");
canvas.width = 32;
canvas.height = 8;
let ctx = canvas.getContext("2d");
function generateHealthBarTexture(health, maxHealth) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FF2222";
    ctx.fillRect(1, 1, canvas.width - 2, canvas.height - 2);
    ctx.fillStyle = "#22FF22";
    ctx.fillRect(1, 1, health / maxHealth * canvas.width - 2, canvas.height - 2);
    return new THREE.TextureLoader().load(canvas.toDataURL());
}

export default class ClientPlayer extends Player {
    get angleFacing() { return super.angleFacing; };
    set angleFacing(angle) { if (this.angleFacing !== angle) { super.angleFacing = angle; Core.socket.emit("move.angleFacing", { angle }); }};

    constructor(data) {
        super(data);

        var geometry = new THREE.BoxGeometry( this.w, this.h, 5 );
        //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        let cube = new THREE.Mesh( geometry, material );
        cube.position.z = 2.5;
        let outline = new THREE.Mesh( geometry, outlineMaterial );
        outline.position.z = 2.5;
        outline.scale.multiplyScalar(1.05)
        
        let gun = GunModels.handgunMesh;
        gun.position.z = 3;
        gun.position.x = 3;
        gun.position.y = -1;

        this.group = new THREE.Group();
        this.group.add(cube);
        this.group.add(outline);
        this.group.add(gun);
        this.group.position.x = this.x;
        this.group.position.y = this.y;
        this.group.position.z = 0.25

        this.hpSpriteMaterial = new THREE.SpriteMaterial( { map: generateHealthBarTexture(this.health, 10) } );
        let hpSprite = new THREE.Sprite( this.hpSpriteMaterial );
        hpSprite.position.z = 6.5;
        hpSprite.scale.x = canvas.width / canvas.height;
        hpSprite.scale.multiplyScalar(0.5);
        this.group.add(hpSprite);

        Core.scene.add( this.group );

        this.wasInteractPressed = false;
    }

    dataUpdate(data, now) {
        // dont update angle facing for current player
        if (data.id === Core.playerId) {
            delete data.angleFacing;
        }

        if (data.health !== this.health) {
            this.hpSpriteMaterial.map = generateHealthBarTexture(data.health, 10);
        }

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

        let hop = Math.sin(Date.now() / 45 + this.hashCode) * this.body.speed * 1.5;
        this.group.position.z = Math.max(hop, 0) + 0.25;
    }

    clientUpdate() {
        if (this.id === Core.playerId) {
            if (Core.keys[KEYS.E] && !this.wasInteractPressed) {
                Core.socket.emit("move.interact");
                this.wasInteractPressed = true;
            } else if (this.wasInteractPressed && !Core.keys[KEYS.E]) {
                this.wasInteractPressed = false;
            }

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