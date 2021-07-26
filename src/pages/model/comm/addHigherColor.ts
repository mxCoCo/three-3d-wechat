/**
 * 鼠标单击高亮
 */
 import * as THREE from 'three'
 import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
 import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
 import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
 import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
 import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
 
 /* 选中模型的数组  颜色 */
 /**
  *
  * @param {mesh数组} selectedObjects
  * @param {高亮的颜色} color
  * @param {scene/camera/renderer} config
  */
 let composer, renderPass, outlinePass, effectFXAA
 const addHigherColor = ( color:any, scene:any, camera:any, renderer:any) => {
   // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
   composer = new EffectComposer(renderer)
 
   // 新建一个场景通道  为了覆盖到原理来的场景上
   renderPass = new RenderPass(scene, camera)
   composer.addPass(renderPass)
 
   // 物体边缘发光通道
   outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight),scene, camera)
 
   outlinePass.edgeStrength = 3.0 // 边框的亮度
   outlinePass.edgeGlow = 1 // 光晕[0,1]
   outlinePass.usePatternTexture = false // 是否使用父级的材质
   outlinePass.edgeThickness = 1.0 // 边框宽度
   outlinePass.downSampleRatio = 2 // 边框弯曲度
  //  outlinePass.pulsePeriod = 5 // 呼吸闪烁的速度
   outlinePass.visibleEdgeColor.set(color) // 呼吸显示的颜色
   outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0) // 呼吸消失的颜色
   outlinePass.clear = true
   composer.addPass(outlinePass)
 
   // 自定义的着色器通道 作为参数
   effectFXAA = new ShaderPass(FXAAShader)
   effectFXAA.uniforms.resolution.value.set(1 / window.innerWidth, 1 / window.innerHeight)
   effectFXAA.renderToScreen = true
   composer.addPass(effectFXAA)
   return {
       composer, // composer在render循环函数中调用
       outlinePass // 实例化一次后设置  outlinePass.selectedObjects = selectedObjects
   }
 }
 
 export default addHigherColor
 
 