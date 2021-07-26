import React, {useEffect, useState ,useRef} from 'react';
import {Slider, Icon, Toast} from 'antd-mobile';
import styles from './model.module.scss'
import SessionStorage from '../../util/sessionStorage';
import * as THREE from 'three';
import { WEBGL } from 'three/examples/jsm/WebGL';
import {createScene} from './comm/scene';
import {createCamera} from './comm/camera';
import {createRenderer} from './comm/renderer';
import {createOrbitControls} from './comm/orbitControls';
import {createBox} from './comm/box3';
import {dealGLTFLoader} from './comm/dealGLTFLoader';
import {createLights} from './comm/lights';
import addHigherColor from './comm/addHigherColor';
// import Stats from 'three/examples/jsm/libs/stats.module';

let camera:any, scene:any, renderer:any;
let controls: any;
let stats: any;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
let sliderTimer:any = null;
let composer:any, outlinePass:any;

let isMove: any = false;
let mouseX: any = 0;
let mouseY: any = 0;
let sceneBackColor:any = ['rgb(236, 236, 236)','rgb(205, 199, 224)','rgb(101, 99, 99)'];
/**handleRotation方式旋转 */
let rotateStartPoint = new THREE.Vector3(0, 0, 1);
let rotateEndPoint = new THREE.Vector3(0, 0, 1);
let rotationSpeed = 8;
let curQuaternion:any;
/**防抖渲染定时器timer */
let timeOut:any = null;
let renderEnabled:any = false;

const Model = (props: any) => {

    const canvasRef:any = useRef();
    const [sceneBackIndex,setSceneBackIndex] = useState<any>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [progressText, setProgressText] = useState("loading......");
    // 控制tab选项卡索引
    const [activeTabIndex,setActiveTabIndex] = useState<any>(-1);
    // 控制滑块显示索引
    const [activeSliderIndex,setActiveSliderIndex] = useState<any>(-1);
    // 模型初始化缩放大小值
    const [initScale,setInitScale] = useState<any>(0);
    // 网格模型集合
    const [meshData,setMeshData] = useState<any>(null);
    const tabWrapRef = useRef<any>(null);
    const indexPageRef = useRef<any>(null);
    
    useEffect(() => {
      setIsLoading(true);
        const cacheAccessId = SessionStorage.get("accessId");
        if(cacheAccessId){
          renderModel(cacheAccessId);
        }else {
          const accessId = getSearchParam("accessId");
          if(accessId){
            SessionStorage.set("accessId",accessId);
            renderModel(accessId);
            return;
          }
          if(props.location.state && props.location.state.accessId){
            const val = props.location.state.accessId;
            SessionStorage.set("accessId",val);
            renderModel(val);
          }
        }
        return ()=>{
          SessionStorage.remove("accessId");
        }
    }, [])

    useEffect(() => {
      // onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} 
      // if(IsPC()){
      //   document.addEventListener('mousedown', onMouseDown, false);
      //   document.addEventListener('mousemove', onMouseMove, false);
      //   document.addEventListener('mouseup', onMouseUp, false);
      // }
      // return ()=>{
      //   if(IsPC()){
      //     document.removeEventListener('mousedown', onMouseDown, false);
      //     document.removeEventListener('mousemove', onMouseMove, false);
      //     document.removeEventListener('mouseup', onMouseUp, false);
      //   }
      // }
    }, [])

    /**判断当前环境是否为pc端 */
    const IsPC = () => {
      let userAgentInfo = navigator.userAgent;
      let Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
      let flag = true;
      for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
      }
      return flag;
    }

    /**绑定模型点击事件 */
    const onMouseDown = (event:any) => {
      // 手动控制旋转的坐标
      isMove = true;

      //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
      if(!IsPC()){
        if(event.touches && event.touches.length > 1){
          return;
        }
        if (event.changedTouches) {
            let touch = event.changedTouches[0]; //touches数组对象获得屏幕上所有的touch，取第一个touch
            mouse.x = (touch.pageX / window.innerWidth) * 2 - 1;
            mouse.y = -(touch.pageY / window.innerHeight) * 2 + 1;
            // 手动控制旋转的坐标
            mouseX = touch.pageX;
            mouseY = touch.pageY;
        }
      }else {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        // 手动控制旋转的坐标
        mouseX = event.pageX;
        mouseY = event.pageY;
      }

      rotateStartPoint = projectOnTrackball(0, 0);

      // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
      raycaster.setFromCamera( mouse, camera );

      // 获取raycaster直线和所有模型相交的数组集合
      const groupArr = scene.children.filter((one:any) => one.type =='Group');
      const meshArr = groupArr.map((one:any) => one.children);
      const meshs = meshArr.flat();
      // console.log(meshs)
      let intersects:any = raycaster.intersectObjects([...meshs], true);

      if(intersects && intersects.length > 0){
        const new_intersects = intersects.filter((one:any) =>one.object.visible==true);
        if(new_intersects && new_intersects.length > 0){
          let selectMesh = new_intersects[0];
          const selectIndex = meshs.findIndex((one:any) =>one.id==selectMesh.object.id);
          // const leftPx = selectIndex * 102;
          if(selectIndex < 2){
            tabWrapRef.current.scrollLeft = 0;
          }else {
            tabWrapRef.current.scrollLeft = (selectIndex-2)*105 + 100;
          }
  
          outlinePass.selectedObjects = [meshs[selectIndex]]
          // 调整选中模型透明度为50%
          // meshs.forEach((m:any) => {
          //   m.material.transparent = true;
          //   m.material.opacity = 0.5;
          // });
          // meshs[selectIndex].material.transparent = true;
          // meshs[selectIndex].material.opacity = 1;
  
          setActiveTabIndex(selectIndex)
          setActiveSliderIndex(-1)
        }
      }
      render();

    }

    /**绑定模型移动事件 */
    const onMouseMove = (e:any) => {
      if (isMove) {
        let x = 0;
        let y = 0;
        if(!IsPC()){
          if(e.touches && e.touches.length > 1){
            return;
          }
          if (e.changedTouches) {
            let touch = e.changedTouches[0]; //touches数组对象获得屏幕上所有的touch，取第一个touch
            x = touch.pageX;
            y = touch.pageY;
          }
        }else {
          x = e.pageX;
          y = e.pageY;
        }
        
        let _x = x - mouseX;
        let _y = y - mouseY;
        const groupArr = scene.children.filter((one:any) => one.type =='Group');
        groupArr.forEach((g:any)=>{
          // g.rotation.x += _y * (Math.PI / 360);
          // g.rotation.y += _x * (Math.PI / 360);
          // const deltaRotationQuaternion = new THREE.Quaternion()
          // .setFromEuler(new THREE.Euler(
          //       _y * (Math.PI / 360),
          //       _x * (Math.PI / 360),
          //     0,
          //     'XYZ'
          // ));
  
          // g.quaternion.multiplyQuaternions(g.quaternion, deltaRotationQuaternion);
          handleRotation(g,_x,_y)

        })

        
        mouseX = x;
        mouseY = y;
        // render();
        timeRender();
      }
    }

    /**绑定模型移动结束事件 */
    const onMouseUp = () => {
      isMove = false;
    }

    /**handleRotation方式旋转 */
    const handleRotation = (cube:any, deltaX:any, deltaY:any) => {
        rotateEndPoint = projectOnTrackball(deltaX, deltaY);

        let rotateQuaternion = rotateMatrix(rotateStartPoint, rotateEndPoint);
        curQuaternion = cube.quaternion;
        curQuaternion.multiplyQuaternions(rotateQuaternion, curQuaternion);
        curQuaternion.normalize();
        cube.setRotationFromQuaternion(curQuaternion);

        rotateEndPoint = rotateStartPoint;
        // rotateStartPoint = rotateEndPoint;
    };

    const rotateMatrix = (rotateStart:any, rotateEnd:any) =>{
        var axis = new THREE.Vector3(),
            quaternion = new THREE.Quaternion();

        var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());

        if (angle)
        {
            axis.crossVectors(rotateStart, rotateEnd).normalize();
            angle *= rotationSpeed;
            quaternion.setFromAxisAngle(axis, angle);
        }
        return quaternion;
    }

    const projectOnTrackball = (touchX:any, touchY:any) => {
        var mouseOnBall = new THREE.Vector3();

        mouseOnBall.set(
            clamp(touchX / window.innerWidth / 2, -1, 1), clamp(-touchY / window.innerHeight / 2, -1, 1),
            0.0
        );

        // mouseOnBall.set(
        //     ( touchX - window.innerWidth * 0.5 ) / (window.innerWidth * .5),
        //     ( window.innerHeight * 0.5 - touchY ) / ( window.innerHeight * .5),
        //   0.0
        // );

        var length = mouseOnBall.length();

        if (length > 1.0)
        {
            mouseOnBall.normalize();
        }
        else
        {
            mouseOnBall.z = Math.sqrt(1.0 - length * length);
        }

        return mouseOnBall;
    }

    const clamp = (value:any, min:any, max:any) => {
        return Math.min(Math.max(value, min), max);
    }
    

    /**
     * 获取浏览器请求参数
     * @param key 
     * @returns 
     */
    const getSearchParam = (key:any) => {
      const { search } = props.location;
      const paramsString = search.substring(1);
      const searchParams = new URLSearchParams(paramsString);
      const value = searchParams.get(key);
      return value;
    }

    /**
     * 渲染模型
     */
    const renderModel = async (modelId:any) => {
      // 检查当前环境是否支持
      if (!WEBGL.isWebGLAvailable()) {
        const warning = WEBGL.getWebGLErrorMessage();
        document.getElementById('container')?.appendChild(warning);
      }
      //stats对象初始化  
      // stats = Stats();  
      // stats.domElement.style.position = 'absolute'; //绝对坐标  
      // stats.domElement.style.left = '0px';// (0,0)px,左上角  
      // stats.domElement.style.top = '0px';  
      // document.getElementById('container')?.appendChild(stats.domElement);
      
      // 获取渲染dom
      let viewEle: any = document.getElementById("view-model");
      // 创建场景scene
      scene = createScene(sceneBackColor[sceneBackIndex]);
      // 创建相机camera
      camera = createCamera();
      // 创建渲染器renderer
      renderer = createRenderer();
      const addHigherColorObj = addHigherColor("#dad8d8",scene,camera,renderer);
      composer = addHigherColorObj.composer;
      outlinePass = addHigherColorObj.outlinePass;
      // dom添加渲染文档到页面
      viewEle.appendChild(renderer.domElement);
      // 请求加载模型数据
      let sceneData = await dealGLTFLoader(modelId,setProgressText);
      setIsLoading(false);
      if(!sceneData){
        Toast.fail('模型加载失败', 2);
        return;
      }
      // 模型数据添加到场景
      scene.add(sceneData);
      setMeshData(sceneData.children);

      // 添加灯光
      const { ambientLight, mainLight_one, mainLight_two, mainLight_three, mainLight_four, mainLight_five, mainLight_six } = createLights();
      scene.add(ambientLight, mainLight_one, mainLight_two, mainLight_three, mainLight_four, mainLight_five, mainLight_six);
      
      // 根据模型数据、创建包围盒、计算模型大小和中心位置
      let Box:any = createBox(sceneData);
      // 设置相机位置，为模型中心位置
      frameArea(Box.boxSize * 1.0, Box.boxSize, Box.boxCenter, camera);
      // // 计算模型缩放比例，并初始化模型大小
      let scale = getFitScaleValue(sceneData);
      sceneData.scale.set(scale,scale,scale);
      setInitScale(scale);
      // 创建控制器、控制模型显示旋转变化
      controls = createOrbitControls(camera,renderer.domElement);
      controls.addEventListener('change', timeRender); // use if there is no animation loop
      controls.minDistance = 0.1; // 设置最小缩放距离，也就是模型最大的缩放比例
      controls.maxDistance = 5; // 设置最大缩放距离，也就是模型最小的缩放比例
      controls.rotateSpeed = 4; //旋转速度 
      controls.zoomSpeed = 2; //变焦速度
      controls.panSpeed = 2;//平移速度 
      controls.enableDamping = false;
      // controls.dynamicDampingFactor = 1;//动态阻尼系数 就是灵敏度 
      controls.enableRotate = false; //是否可以旋转
      controls.enableZoom = true; //是否可以缩放
      controls.enablePan = true; //是否可以平移
      controls.minPolarAngle = 0; //垂直旋转最小的角度
      controls.maxPolarAngle = Math.PI; //垂直旋转最大的角度 Math.PI
      controls.minAzimuthAngle = 0; //水平旋转最小的角度
      controls.maxAzimuthAngle = 2*Math.PI; //水平旋转最小的角度
      controls.target.set(0, 0, 0);// 设置控制器旋转轴的位置
      // controls.update();

      render();
      animate();
      window.addEventListener('resize', onWindowResize);
    }

    /**定时器 */
    const timeRender = () => {
      //设置为可渲染状态
        renderEnabled = true;
        //清除上次的延迟器
        if (timeOut) {
            clearTimeout(timeOut);
        }
    
        timeOut = setTimeout(function () {
            renderEnabled = false;
        }, 3000);
    }

    /**获取真实缩放比例 */
    const getRealRate = (rate:any) => {
      if(rate <= 0.01){
        return rate*15;
      }else if(rate > 0.01 && rate <= 0.1){
        return rate*15;
      }else if(rate > 0.1 && rate <= 1){
        return rate;
      }else if(rate > 1 && rate <= 10){
        return rate;
      }else if(rate > 10 && rate <= 100){
        return rate/3;
      }else if(rate > 100 && rate <= 1000){
        return rate/3;
      }else if(rate > 1000 && rate <= 3000){
        return rate/100;
      }

    }

    /**计算真实缩放比例 */
    const getFitScaleValue =(obj:any)=> {
      const tempScale = 0.21914148330688477;
      var boxHelper = new THREE.BoxHelper(obj);
      boxHelper.geometry.computeBoundingBox();
      let box:any = boxHelper.geometry.boundingBox;
      let maxDiameter = Math.max((box.max.x - box.min.x), (box.max.y - box.min.y), (box.max.z - box.min.z));
      let scaleRate = maxDiameter/tempScale;
      scaleRate = getRealRate(scaleRate);
      let scale_calc = maxDiameter / (2 * Math.tan(camera.fov * Math.PI / 360));
      let scale = 1/4/scale_calc * scaleRate;// 手动修改调整，控制默认初始化的缩放比例系数
      return scale;
    }

    const frameArea = (sizeToFitOnScreen:any, boxSize:any, boxCenter:any, camera:any) =>{
    
      const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
      const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
      const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
      const direction = new THREE.Vector3()
        .subVectors(camera.position, boxCenter)
        .multiply(new THREE.Vector3(1, 0, 1))
        .normalize();
    
      // move the camera to a position distance units way from the center
      // in whatever direction the camera was from the center already
      camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
    
      // pick some near and far values for the frustum that
      // will contain the box.
      camera.near = boxSize / 100;
      camera.far = boxSize * 100;
    
      camera.updateProjectionMatrix();
    
      // point the camera to look at the center of the box
      camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
    }

    /**
     * 屏幕大小改变，重新渲染
     */
    const onWindowResize = ()=> {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.outputEncoding = THREE.sRGBEncoding;
      render();
    }
    /**
     * 执行渲染方法
     */
    const render = ()=> {
      renderer.render( scene, camera );
      // stats.update();
      if (composer) {
        composer.render()
      } 
    }
    /**
     * 执行渲染方法
     */
    const animate = ()=> {
      requestAnimationFrame(animate);
      if(renderEnabled){
        renderer.render( scene, camera );
        // stats.update();
        if (composer) {
          composer.render()
        } 
        if (controls) {
          controls.update()
        } 
      }
    }

    /**
     * 切换模型tab
     */
    const handleChangeTab = (ind:any,mesh:any) => {
      setActiveTabIndex(ind)
      setActiveSliderIndex(ind)
      outlinePass.selectedObjects = [mesh]
      render();
    }

    /**
     * 切换滑块显隐控制
     */
    const handleChangeSlider = () => {
      setActiveTabIndex(-1);
      setActiveSliderIndex(-1);
    }

    /**
     * 
     * @param Mesh 控制模型显隐
     */
    const showMesh = (Mesh:any,eve:any) => {
      eve.stopPropagation();
      let obj:any= scene.getObjectById(Mesh.id);
      obj.visible  = !obj.visible;
      let meshData_new = [...meshData];
      setMeshData(meshData_new);
      render();
    }
    
    /**
     * 滑动透明度滑块slider事件
     */
    const handleSlider = (val:any,mesh:any) => {
      if(sliderTimer){
        clearTimeout(sliderTimer);
      }
      sliderTimer = setTimeout(()=>{
        let obj:any= scene.getObjectById(mesh.id);
        obj.material.transparent = true;
        obj.material.side = THREE.FrontSide
        if(mesh.name == '皮肤'){
          if(val == 100){
            obj.material.depthTest = true;
          }else {
            obj.material.depthTest = false;
          }
        }
        // obj.material.depthTest = false;
        // obj.material.depthWrite = false;
        obj.material.opacity = (val/100).toFixed(1);
        let meshData_new = [...meshData];
        setMeshData(meshData_new);
        render();
        
      },100)
    }

    /**
     * 重置模型初始的位置
     */
    const handleResetModel = (eve:any)=> {
      eve.stopPropagation();
      if(controls){
        controls.reset();
      }
      // if(camera){
      //   camera.fov = 35;
      //   camera.updateProjectionMatrix();
      // }
      outlinePass.selectedObjects = [];

      const groupArr = scene.children.filter((one:any) => one.type =='Group');
      groupArr.forEach((g:any)=>{
        // g.rotation.x = 0
        // g.rotation.y = 0
        const deltaRotationQuaternion = new THREE.Quaternion()
          .setFromEuler(new THREE.Euler(
              0,
              0,
              0,
              'XYZ'
          ));
        g.quaternion.multiplyQuaternions(deltaRotationQuaternion, deltaRotationQuaternion);
      })
      render();
    }

    /**
     * 切换场景背景色
     */
    const handleChangeSceneBack = () => {
      let index:any = sceneBackIndex+1;
      if(index >= sceneBackColor.length){
        index = 0;
      }
      const val = sceneBackColor[index];
      setSceneBackIndex(index);
      scene.background = new THREE.Color(val);
      indexPageRef.current.style = `background: ${val};`;
      render();
    }

    /**
     * 解析计算模型颜色color：rgb
     */
    const parseMeshColor = (mesh:any) => {
      let color = mesh.material.color;
      let r = (color.r * 255).toFixed(3);
      let g = (color.g * 255).toFixed(3);
      let b = (color.b * 255).toFixed(3);
      let color_rgb = `rgb(${r},${g},${b})`;
      return color_rgb;
    }
  
    return (
        <div id="container" ref={indexPageRef} className={styles.indexPage}>
          <div className={styles.topWrap}>
            <span className={`${styles.reset} iconfont`} onClick={(eve:any)=>{handleResetModel(eve)}}>&#xe60a;</span>
            <span className={`${styles.back} iconfont`} onClick={(eve:any)=>{handleChangeSceneBack()}}>&#xe65e;</span>
          </div>
          <div className={styles.bottomWrap} onClick={(eve:any)=>eve.stopPropagation()}>
            <div className={styles.sliderWrap}>
              {meshData && meshData.length > 0?
                  meshData.map((mesh:any,index:any) => (
                      <div className={`${activeSliderIndex == index?styles.slider_item+' '+styles.activeTab:styles.slider_item}`} style={{display:'none'}}
                        key={mesh.name}>
                        <div className={styles.left_arrow} onClick={() =>handleChangeSlider()}>
                          <Icon type={"down"} size={'md'} color={'#fff'}/>
                        </div>
                        <div className={styles.transparent_wrap}>
                          <div className={styles.transparent_label}>透明度</div>
                          <Slider
                            key={mesh.name}
                            defaultValue={mesh.material.opacity * 100}
                            min={0}
                            max={100}
                            onChange={(val)=>handleSlider(val,mesh)}
                          />
                        </div>
                        <div className={styles.opacity_value}>{`${mesh.material.opacity * 100}%`}</div>
                      </div>
                  ))
                :null  
              }
            </div>
            <div className={styles.tabWrap} ref={tabWrapRef} onClick={(eve:any)=>eve.stopPropagation()}>
              {meshData && meshData.length > 0?
                  meshData.map((mesh:any,index:any) => (
                      <div className={`${activeTabIndex == index?styles.tab_item+' '+styles.activeTab:styles.tab_item}`}
                        key={mesh.name}
                        onClick={() =>handleChangeTab(index,mesh)}>
                        <div className={styles.model_block_color} style={{background:parseMeshColor(mesh)}}>
                          {mesh.visible?<span className={`${styles.icon} iconfont`} onClick={(eve:any)=>showMesh(mesh,eve)}>&#xe663;</span>
                          :<span className={`${styles.iconHidder} iconfont`} onClick={(eve:any)=>showMesh(mesh,eve)}>&#xe661;</span>
                          }
                        </div>
                        <div className={styles.model_block}>
                          <span className={styles.model_name}>
                            {mesh.name}
                          </span>
                          <span className={styles.model_size}>
                            
                          </span>
                        </div>
                      </div>
                  ))
                :null  
              }
            </div>
          </div>
          <div id="view-model" ref={canvasRef} className={styles.viewModel} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onTouchStart={onMouseDown} onTouchMove={onMouseMove} onTouchEnd={onMouseUp}>
            {IsPC()?<div className={styles.blank_pane}>
              </div>:null}
          </div>
          <div className={styles.shadePane} style={{display:isLoading?'flex':'none'}}>
            <Icon type={"loading"} size={'lg'} color={'#fff'}/>
            <span>{progressText}</span>
          </div>
        </div>
    )
}

export default Model