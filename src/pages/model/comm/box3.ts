import * as THREE from 'three';

function createBox(sceneData:any) {
    const box = new THREE.Box3().setFromObject(sceneData);

  const boxSize = box.getSize(new THREE.Vector3()).length();
  const boxCenter = box.getCenter(new THREE.Vector3());

  return { box, boxSize, boxCenter };
}
  
export { createBox };