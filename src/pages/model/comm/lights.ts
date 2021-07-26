import * as THREE from 'three';

function createLights() {
    let ambientLight = new THREE.HemisphereLight("0xffffff", "0xffffff", 0.1);
    ambientLight.position.set(2, 2, 2);
    
    let mainLight_one = new THREE.DirectionalLight("#ffffff", 0.5);
    mainLight_one.position.set(-5, 6, 24);
    let mainLight_two = new THREE.DirectionalLight("#ffffff", 0.5);
    mainLight_two.position.set(1.5, -21.6, 8);
    let mainLight_three = new THREE.DirectionalLight("#ffffff", 0.5);
    mainLight_three.position.set(1, 0, 37);

    let mainLight_four = new THREE.DirectionalLight("#ffffff", 0.5);
    mainLight_four.position.set(5, -6, -24);

    let mainLight_five = new THREE.DirectionalLight("#ffffff", 0.5);
    mainLight_five.position.set(-10, 10, -10);

    let mainLight_six = new THREE.DirectionalLight("#ffffff", 0.5);
    mainLight_six.position.set(10, 10, -10);

    return { ambientLight, mainLight_one, mainLight_two, mainLight_three, mainLight_four, mainLight_five, mainLight_six };
}

export { createLights };