//import * as THREE from 'three';

export default {
    Build: (renderer, scene, map) => {
        for (var i = 0; i < map.objQueue.length; i++) {
            let mesh = null;
            let { name, x, y, w, h, color, zHeight } = map.objQueue[i];
            if (name === "wall") {
                var wallGeometry = new THREE.BoxGeometry( w, h, zHeight );
                var wallMaterial = new THREE.MeshLambertMaterial( { color } );
                mesh = new THREE.Mesh( wallGeometry, wallMaterial );
                mesh.position.x = x;
                mesh.position.y = y;
                mesh.position.z = zHeight / 2;
            }

            if (mesh) {
                scene.add(mesh);
            }
        }

        renderer.clippingPlanes = [
            new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), map.bounds.w / 2 ),
            new THREE.Plane( new THREE.Vector3( -1, 0, 0 ), map.bounds.w / 2 ),
            new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), map.bounds.h / 2 ),
            new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), map.bounds.h / 2 )
        ];
    }
}