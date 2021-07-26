import React, {useEffect, useState ,useRef} from 'react';
import {List, InputItem, Button,Toast} from 'antd-mobile';
import styles from './index.module.scss'

const IndexPage = (props: any) => {
    const accessIdRef:any = useRef();

    useEffect(() => {
    }, [])
    
    /**
     * 加载模型
     */
     const loadModel = () => {
        const val = accessIdRef.current.value;
        if(val){
            window.scroll(0, document.documentElement.scrollHeight);
            setTimeout(()=>{
              props.history.push({
                  pathname: '/model',
                  state: {accessId:val},
              });
            },200)
        }else {
            Toast.fail('请输入模型ID', 1);
        }
    }

    const handleKeyUp = () => {
        const e:any = window.event;
        if (e.keyCode == 13){
          const val = accessIdRef.current.value;
          if(val){
            props.history.push({
              pathname: '/model',
              state: {accessId:val},
            });
          
          }else {
            Toast.fail('请输入模型ID', 1);
          }
        }
      }

    return (
        <div className={styles.indexPage}>
            <div className={styles.inputWrap}>
                <div className={styles.input_div}>
                    {/* <label htmlFor={"modelId"}>模型ID：</label> */}
                    <input id="modelId" placeholder="请输入模型ID" 
                    ref={accessIdRef} 
                    onKeyUp={()=>handleKeyUp()} 
                    onBlur={() => { window.scroll(0, document.documentElement.scrollHeight) }}
                    />
                </div>
                <div className={styles.load_btn}>
                    <Button className={styles.btn} type="primary" onClick={loadModel}>查看模型</Button>
                </div>
            </div>
        </div>
    )

}

export default IndexPage