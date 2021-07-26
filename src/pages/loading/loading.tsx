import React from 'react';
import {ActivityIndicator} from 'antd-mobile';
import styles from './loading.module.scss'

function Loading(props: any, ref: any) {
    return (
        <div id={'edc-loading'} className={styles.lx_loading}>
            <ActivityIndicator animating={props.loading} size={"small"} text={'正在加载数据'} toast/>
        </div>
    )
}

export default Loading;