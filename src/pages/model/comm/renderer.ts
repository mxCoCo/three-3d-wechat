import * as THREE from 'three';

function createRenderer() {
    const renderer = new THREE.WebGLRenderer({antialias: true,alpha:true, logarithmicDepthBuffer: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight/100*90 );
    renderer.sortObjects = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    return renderer;
  }
  
  export { createRenderer };
  