import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

async function dealGLTFLoader(accessId:any,setProgressText:Function) {
    // let reqUrl = "https://www.licyo.net/medicalimagedm/oss/downloadbyID?accessId=";
    let reqUrl = "http://localhost:8001/medicalimagedm/oss/downloadbyID?accessId=";
    
    const loader = new GLTFLoader();
    try {
        const gltf:any =  await loader.loadAsync(
            reqUrl+accessId
        //   "https://3dmodelpub.oss-cn-shanghai.aliyuncs.com/202103/2021030101.glb"
        ,(xhr:any)=>{
            if (xhr.lengthComputable) {
                let percentComplete = xhr.loaded / xhr.total * 100;
                let nubs = percentComplete.toFixed(0);
                let loadtxt = '完成：' + nubs + '%';
                setProgressText(loadtxt)
            }
        });
        
        const meshList = sortMesh(gltf.scene.children);
        meshList.map((one:any)=>{
            one.geometry.dispose(); //删除几何体
            one.material.dispose(); //删除材质
        })
        gltf.scene.children = meshList;
        return gltf.scene;
    } catch (error) {
        console.log("model of loader is error!")
        return null;
    }
}

const sortArr:any = ['皮肤','骨骼','动脉','静脉','肿瘤','异物'];

const sortMesh = (meshList:any) => {
    let meshArr:any = [];
    const matchArr = meshList.filter((one:any) => sortArr.findIndex((value:any)=>value == one.name) > -1);
    const matchSortArr = sortMatchMesh(matchArr);
    const noMatchArr = meshList.filter((one:any) => sortArr.findIndex((value:any)=>value == one.name) == -1);
    meshArr = [...matchSortArr,...noMatchArr]
    return meshArr;
}

const sortMatchMesh = (matchArr:any) => {
    let matchSortArr = [];
    if(matchArr && matchArr.length > 0){
        const pf = matchArr.find((item:any,index:any,arr:any)=>{
            return item.name=='皮肤'
        });
        if(pf){
            pf.material.transparent = true;
            pf.material.side = THREE.FrontSide
            pf.material.depthTest = false;
            pf.material.opacity = 0.5;
            matchSortArr.push(pf);
        }
        const gg = matchArr.find((item:any,index:any,arr:any)=>{
            return item.name=='骨骼'
        });
        if(gg){
            gg.material.transparent = true;
            gg.material.side = THREE.FrontSide
            // gg.material.opacity = 0.5;
            matchSortArr.push(gg);
        }
        const dm = matchArr.find((item:any,index:any,arr:any)=>{
            return item.name=='动脉'
        });
        if(dm){
            matchSortArr.push(dm);
        }
        const jm = matchArr.find((item:any,index:any,arr:any)=>{
            return item.name=='静脉'
        });
        if(jm){
            matchSortArr.push(jm);
        }
        const zl = matchArr.find((item:any,index:any,arr:any)=>{
            return item.name=='肿瘤'
        });
        if(zl){
            matchSortArr.push(zl);
        }
        const yw = matchArr.find((item:any,index:any,arr:any)=>{
            return item.name=='异物'
        });
        if(yw){
            matchSortArr.push(yw);
        }
    }
    return matchSortArr
}
  
export { dealGLTFLoader };