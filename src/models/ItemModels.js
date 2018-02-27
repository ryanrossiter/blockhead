import COMMON from '../common/common';
let { ITEMS } = COMMON;

//import * as THREE from 'three';

let handgunGeom = new THREE.BoxGeometry(2, 0.8, 0.8);
let handleGeom = new THREE.BoxGeometry(0.5, 0.5, 1.5);
handgunGeom.merge(handleGeom, new THREE.Matrix4().makeRotationY(0.1).setPosition({x: -0.7, y: 0, z: -1.3}));

let rifleGeom = new THREE.BoxGeometry(3, 1, 1);
rifleGeom.merge(handleGeom, new THREE.Matrix4().makeRotationY(0.1).setPosition({x: -0.8, y: 0, z: -1.3}));
rifleGeom.merge(handleGeom, new THREE.Matrix4().makeRotationY(0.4).setPosition({x: 0.7, y: 0, z: -1}));

const ItemModels = {};
ItemModels[ITEMS.HANDGUN] = { geom: handgunGeom };
ItemModels[ITEMS.RIFLE] = { geom: rifleGeom };
export default ItemModels;