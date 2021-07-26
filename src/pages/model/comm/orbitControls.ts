import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function createOrbitControls(camera:any,renderElement:any) {
    let controls:any = new OrbitControls(camera, renderElement);
    return controls;
}
  
export { createOrbitControls };