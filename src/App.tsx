import React, {useEffect, useState} from 'react';
import './App.less';
import 'antd-mobile/dist/antd-mobile.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import RootRouter from './routes/Router'

function App(prop: any) {

    useEffect(() => {
        
    }, [])

    return (
        <div className="App">
            <Router basename={"/mr-wechat3d"}>
                <RootRouter/>
            </Router>
        </div>
    );
}

export default App;
