import * as THREE from 'three';

export default {
    Build: (scene, map) => {
        for (var i = 0; i < map.objQueue.length; i++) {
            let mesh = null;
            let { name, x, y, w, h, color, zHeight } = map.objQueue[i];
            if (name === "rectangle") {
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
    }
}