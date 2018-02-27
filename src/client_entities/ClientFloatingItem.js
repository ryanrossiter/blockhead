import Core from '../core';
import FloatingItem from '../common/entities/FloatingItem';
import ItemModels from '../models/ItemModels';

//import * as THREE from 'three';

// const barrelGeom = new THREE.CylinderGeometry( 1.5, 1.5, 3 );
// const material = new THREE.MeshToonMaterial( {
//     //map: imgTexture,
//     //bumpMap: imgTexture,
//     //bumpScale: bumpScale,
//     color: 0xCC1111,
//     specular: 0.2,
//     reflectivity: 0.2,
//     shininess: 0.2,
//     envMap: null
// } );

// const outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );

const INTERACT_RADIUS = 8; // also defined in player

const defaultMat = new THREE.MeshBasicMaterial( { color: 0x333333 } );

let canvas = document.createElement('canvas');
canvas.width = canvas.height = 64;
let ctx = canvas.getContext("2d");
ctx.fillStyle = "#FFFFFF";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineWidth = 5;
ctx.strokeRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#000000";
ctx.font = "60px Arial";
ctx.fillText("E", 12, 54);
const eTexture = new THREE.TextureLoader().load(canvas.toDataURL());

export default class ClientFloatingItem extends FloatingItem {
    constructor(data) {
        super(data);

        // let barrel = new THREE.Mesh(barrelGeom, material);
        // let barrelOutline = new THREE.Mesh(barrelGeom, outlineMaterial);
        // barrelOutline.scale.multiplyScalar(1.05);
        let spriteMaterial = new THREE.SpriteMaterial( { map: eTexture } );
        this.eSprite = new THREE.Sprite( spriteMaterial );
        this.eSprite.position.z = 4;
        this.eSprite.scale.multiplyScalar(1.5);
        this.group = new THREE.Group;
        this.group.add(new THREE.Mesh(ItemModels[this.item.type].geom, ItemModels[this.item.type].mat || defaultMat));
        this.group.add(this.eSprite);
        this.group.position.x = this.x;
        this.group.position.y = this.y;
        this.group.position.z = 2.5;

        Core.scene.add( this.group );
    }

    clientUpdate() {
        let player = Core.playerId? Core.entities[Core.playerId] : null;
        this.eSprite.visible = player && player.distanceFrom(this.x, this.y) <= INTERACT_RADIUS;
    }

    geometryUpdate() {
        this.group.position.z = Math.sin(Date.now() / 150 + this.hashCode) * 0.5 + 4;
        this.group.rotation.z = Date.now() / 400 + this.hashCode;
    }

    onDelete() {
        super.onDelete();
        Core.scene.remove(this.group);
    }
}