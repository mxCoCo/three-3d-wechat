import * as THREE from 'three';

function createCamera() {
    // let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
    // camera.position.set( - 1.8, 0.6, 2.7 );
    let camera = new THREE.PerspectiveCamera(30,  3 / 5.0, 0.1, 100);
    camera.position.set(-0.6, 6.5, 6.5);
    return camera;
}
  
export { createCamera };