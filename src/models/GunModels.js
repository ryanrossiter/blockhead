import * as THREE from 'three';

let handgunGeom = new THREE.BoxGeometry(2, 1, 1);
let handleGeom = new THREE.BoxGeometry(0.8, 0.8, 1.5);
handgunGeom.merge(handleGeom, new THREE.Matrix4().setPosition({x: -0.6, y: 0, z: -1.3}));

const gunMat = new THREE.MeshBasicMaterial( { color: 0x333333 } );

export default {
    get handgunMesh() {
        return new THREE.Mesh(handgunGeom, gunMat);
    }
}